export type DeepSeekModel = 'flash' | 'pro'

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface DeepSeekResponse {
  content: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

const MODEL_MAP: Record<DeepSeekModel, string> = {
  flash: 'deepseek-chat',
  pro: 'deepseek-reasoner',
}

const RATE_LIMITS: Record<DeepSeekModel, { requestsPerSecond: number }> = {
  flash: { requestsPerSecond: 10 },
  pro: { requestsPerSecond: 3 },
}

const rateLimitQueues: Record<DeepSeekModel, { timestamps: number[] }> = {
  flash: { timestamps: [] },
  pro: { timestamps: [] },
}

async function rateLimit(model: DeepSeekModel): Promise<void> {
  const limit = RATE_LIMITS[model]
  const queue = rateLimitQueues[model]
  const now = Date.now()

  queue.timestamps = queue.timestamps.filter((t) => now - t < 1000)

  if (queue.timestamps.length >= limit.requestsPerSecond) {
    const oldest = queue.timestamps[0]
    const waitTime = 1000 - (now - oldest)
    await new Promise((resolve) => setTimeout(resolve, waitTime))
    return rateLimit(model)
  }

  queue.timestamps.push(now)
}

async function callWithRetry(
  fn: () => Promise<Response>,
  retries = 3,
  delay = 1000,
): Promise<Response> {
  try {
    const res = await fn()
    if (res.status === 429 && retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay))
      return callWithRetry(fn, retries - 1, delay * 2)
    }
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`DeepSeek API error (${res.status}): ${errorText}`)
    }
    return res
  } catch (error) {
    if (retries > 0 && !(error instanceof Error && error.message.includes('API error'))) {
      await new Promise((resolve) => setTimeout(resolve, delay))
      return callWithRetry(fn, retries - 1, delay * 2)
    }
    throw error
  }
}

export async function callDeepSeek(
  messages: DeepSeekMessage[],
  options: {
    model?: DeepSeekModel
    temperature?: number
    maxTokens?: number
  } = {},
): Promise<DeepSeekResponse> {
  const model = options.model ?? 'flash'
  const apiKey = process.env.DEEPSEEK_API_KEY
  const baseUrl = process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com'

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not set')
  }

  await rateLimit(model)

  const res = await callWithRetry(() =>
    fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL_MAP[model],
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 4096,
      }),
    }),
  )

  const data = await res.json()

  const content = data.choices?.[0]?.message?.content ?? ''
  const usage = {
    prompt_tokens: data.usage?.prompt_tokens ?? 0,
    completion_tokens: data.usage?.completion_tokens ?? 0,
    total_tokens: data.usage?.total_tokens ?? 0,
  }

  return { content, usage }
}

export async function callDeepSeekWithPrompt(
  prompt: string,
  options: {
    model?: DeepSeekModel
    systemPrompt?: string
    temperature?: number
    maxTokens?: number
  } = {},
): Promise<DeepSeekResponse> {
  const messages: DeepSeekMessage[] = []

  if (options.systemPrompt) {
    messages.push({ role: 'system', content: options.systemPrompt })
  }

  messages.push({ role: 'user', content: prompt })

  return callDeepSeek(messages, options)
}
