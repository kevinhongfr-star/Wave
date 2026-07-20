# WAVE — API Routes Specification

**Version**: 2.0
**Date**: 2026-07-20
**Framework**: Next.js 15 App Router (Route Handlers)
**Author**: NEXUS Agent

---

## 1. Overview

All API routes follow Next.js App Router conventions:
- Base path: `/app/api/`
- Authentication: None required (solo user, internal tool)
- Response format: JSON
- Error format: `{ error: string, details?: any }`

### Supabase Access Pattern
All routes use server-side Supabase client with service_role_key:
```typescript
import { createServerClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const supabase = createServerClient()
  const { data, error } = await supabase.from('table').select('*')
  return Response.json({ data, error })
}
```

---

## 2. Content Pieces API

### `GET /api/content`
List all content pieces with filtering.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `type` | string | Filter by content_type |
| `status` | string | Filter by status |
| `source` | string | Filter by source |
| `search` | string | Full-text search on title/description |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 50, max: 200) |
| `sort` | string | Sort field (default: created_at) |
| `order` | string | asc/desc (default: desc) |

**Response:**
```json
{
  "data": [...],
  "total": 150,
  "page": 1,
  "limit": 50
}
```

---

### `POST /api/content`
Create a new content piece.

**Body:**
```json
{
  "title": "Q3 Webinar Recap",
  "content_type": "blog",
  "description": "Summary of Q3 leadership webinar",
  "status": "draft",
  "source": "notion",
  "source_url": "https://notion.so/...",
  "notion_page_id": "abc123",
  "industry_tag": "tech",
  "cluster_tag": "APAC",
  "language": "en",
  "file_url": "https://..."
}
```

**Response:** Created content piece object.

---

### `GET /api/content/[id]`
Get single content piece with related data.

**Response:**
```json
{
  "content": { ... },
  "campaigns": [...],
  "repurposing_jobs": [...],
  "distribution_log": [...],
  "parent_content": { ... }
}
```

---

### `PATCH /api/content/[id]`
Update a content piece.

**Body:** Any subset of content_pieces columns.

**Response:** Updated content piece.

---

### `DELETE /api/content/[id]`
Soft-delete (set status to 'archived') or hard-delete a content piece.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `hard` | boolean | If true, permanently delete (default: false) |

---

## 3. Campaigns API

### `GET /api/campaigns`
List campaigns with filters.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by status |
| `type` | string | Filter by campaign_type |
| `channel` | string | Filter by primary_channel |
| `priority` | string | Filter by priority |
| `active` | boolean | Shortcut for status=active |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response:**
```json
{
  "data": [...],
  "total": 12,
  "summary": {
    "planning": 3,
    "active": 5,
    "completed": 4
  }
}
```

---

### `POST /api/campaigns`
Create a new campaign.

**Body:**
```json
{
  "name": "Q3 APAC Webinar Series",
  "description": "Multi-touch campaign for APAC webinar series",
  "campaign_type": "content",
  "status": "planning",
  "priority": "high",
  "start_date": "2026-08-01",
  "end_date": "2026-09-30",
  "goal_type": "leads",
  "goal_target": 50,
  "primary_channel": "email"
}
```

---

### `GET /api/campaigns/[id]`
Get campaign with all linked entities.

**Response:**
```json
{
  "campaign": { ... },
  "content_pieces": [...],
  "mailing_contacts": [...],
  "distribution_log": [...],
  "inbound_leads": [...],
  "metrics": {
    "total_reach": 1200,
    "total_inbound": 23,
    "content_count": 8
  }
}
```

---

### `PATCH /api/campaigns/[id]`
Update campaign.

---

### `DELETE /api/campaigns/[id]`
Archive or delete campaign.

---

### `POST /api/campaigns/[id]/content`
Link content piece to campaign.

**Body:**
```json
{
  "content_piece_id": "uuid",
  "role": "primary"
}
```

---

### `DELETE /api/campaigns/[id]/content/[content_id]`
Unlink content from campaign.

---

### `POST /api/campaigns/[id]/contacts`
Add contacts to campaign.

**Body:**
```json
{
  "contact_ids": ["uuid1", "uuid2"],
  "segment_filter": { "tags": ["APAC", "C-Suite"] }
}
```

---

## 4. Repurposing API

### `GET /api/repurposing`
List repurposing jobs.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by status |
| `source_id` | string | Filter by source content |
| `format` | string | Filter by target format |
| `page` | number | Page number |
| `limit` | number | Items per page |

---

### `POST /api/repurposing`
Create a new repurposing job.

**Body:**
```json
{
  "source_content_id": "uuid",
  "target_format": "linkedin_post",
  "priority": "high",
  "ai_model": "deepseek-flash",
  "notes": "Create 3 LinkedIn posts from webinar recap"
}
```

**Response:** Created job with status 'queued'.

---

### `POST /api/repurposing/batch`
Create multiple repurposing jobs at once.

**Body:**
```json
{
  "source_content_id": "uuid",
  "targets": [
    { "format": "linkedin_post", "priority": "high" },
    { "format": "blog_post", "priority": "medium" },
    { "format": "email_sequence", "priority": "medium" }
  ],
  "ai_model": "deepseek-pro"
}
```

---

### `POST /api/repurposing/[id]/execute`
Trigger AI execution for a queued job.

This calls DeepSeek API with the appropriate prompt template based on `target_format`.

**Response:**
```json
{
  "job": { ... },
  "ai_output": "Generated content...",
  "tokens_used": 1500,
  "cost_cny": 0.02
}
```

---

### `PATCH /api/repurposing/[id]`
Update job status, checklist items, or notes.

**Body:**
```json
{
  "status": "approved",
  "checklist": {
    "quality_check": true,
    "brand_consistency": true,
    "platform_optimized": true
  },
  "notes": "Approved with minor edits"
}
```

---

### `POST /api/repurposing/[id]/publish`
Publish approved repurposing output → creates new content_piece.

**Response:**
```json
{
  "job": { ... },
  "output_content": { ... }
}
```

---

### `GET /api/repurposing/chains/[source_id]`
Get full repurposing chain for a source content piece.

**Response:**
```json
{
  "source": { "id": "...", "title": "...", "type": "webinar" },
  "outputs": [
    {
      "job_id": "...",
      "format": "blog_post",
      "status": "published",
      "content": { "id": "...", "title": "..." },
      "created_at": "..."
    },
    ...
  ],
  "stats": {
    "total_outputs": 5,
    "published": 3,
    "pending": 2
  }
}
```

---

## 5. Distribution API

### `GET /api/distribution`
List distribution log entries.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `channel` | string | Filter by channel |
| `status` | string | Filter by status |
| `campaign_id` | string | Filter by campaign |
| `from_date` | string | Start date filter |
| `to_date` | string | End date filter |
| `upcoming` | boolean | Only scheduled (future) items |

---

### `POST /api/distribution`
Create a distribution entry.

**Body:**
```json
{
  "content_piece_id": "uuid",
  "campaign_id": "uuid",
  "channel": "email",
  "distribution_type": "scheduled",
  "scheduled_at": "2026-08-15T10:00:00Z",
  "recipient_count": 461,
  "notes": "Part of Q3 APAC campaign"
}
```

---

### `PATCH /api/distribution/[id]`
Update distribution status or tracking metrics.

---

### `POST /api/distribution/[id]/send`
Trigger actual send (for email: via MS Graph API).

---

### `GET /api/distribution/calendar`
Get distribution calendar view.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `from` | string | Start date (YYYY-MM-DD) |
| `to` | string | End date (YYYY-MM-DD) |
| `channel` | string | Filter by channel |

**Response:**
```json
{
  "events": [
    {
      "date": "2026-08-15",
      "items": [
        { "id": "...", "content_title": "...", "channel": "email", "status": "scheduled" }
      ]
    }
  ]
}
```

---

## 6. Mailing List API

### `GET /api/mailing-list`
List contacts.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by status |
| `source` | string | Filter by source |
| `segment` | string | Filter by segment tag |
| `search` | string | Search name/email/company |
| `page` | number | Page number |
| `limit` | number | Items per page |

---

### `POST /api/mailing-list`
Add a contact.

---

### `POST /api/mailing-list/import`
Bulk import contacts from CSV/JSON.

**Body:**
```json
{
  "contacts": [
    { "email": "...", "first_name": "...", "company": "...", "segment_tags": ["APAC"] }
  ],
  "on_conflict": "skip"
}
```

---

### `PATCH /api/mailing-list/[id]`
Update contact.

---

### `DELETE /api/mailing-list/[id]`
Remove contact (soft delete → status = 'do_not_contact').

---

### `GET /api/mailing-list/segments`
List all unique segments and their counts.

---

### `GET /api/mailing-list/stats`
Mailing list health metrics.

**Response:**
```json
{
  "total": 4310,
  "active": 4100,
  "unsubscribed": 150,
  "bounced": 60,
  "avg_engagement_score": 42,
  "by_source": { "import": 3000, "webinar": 800, "event": 510 },
  "recent_growth": { "last_7d": 15, "last_30d": 45 }
}
```

---

## 7. Inbound API

### `GET /api/inbound`
List inbound leads.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by status |
| `source` | string | Filter by source |
| `urgency` | string | Filter by urgency |
| `campaign_id` | string | Filter by source campaign |
| `assigned_to` | string | Filter by assignee |
| `page` | number | Page number |
| `limit` | number | Items per page |

---

### `POST /api/inbound`
Log new inbound lead.

**Body:**
```json
{
  "contact_name": "Jane Smith",
  "email": "jane@company.com",
  "company": "Acme Corp",
  "source": "webinar_registration",
  "source_detail": "Q3 APAC Webinar",
  "message": "Interested in executive coaching",
  "urgency": "high"
}
```

---

### `PATCH /api/inbound/[id]`
Update inbound lead status or details.

---

### `GET /api/inbound/pipeline`
Pipeline summary by status.

**Response:**
```json
{
  "pipeline": [
    { "status": "new", "count": 5, "urgent_count": 2 },
    { "status": "acknowledged", "count": 3, "urgent_count": 0 },
    ...
  ],
  "total_open": 15,
  "avg_response_time_hours": 24
}
```

---

## 8. Templates API

### `GET /api/templates`
List templates.

---

### `POST /api/templates`
Create template.

---

### `POST /api/templates/[id]/generate`
Use AI to generate content from a template.

**Body:**
```json
{
  "variables": {
    "recipient_name": "John",
    "company": "Acme Corp",
    "topic": "AI Leadership"
  },
  "ai_model": "deepseek-flash"
}
```

**Response:** Generated content.

---

## 9. Dashboard API

### `GET /api/dashboard/stats`
Aggregated stats for the main dashboard.

**Response:**
```json
{
  "campaigns": { "active": 5, "planning": 2, "completed_this_month": 1 },
  "content": { "total": 150, "created_this_month": 12, "published": 89 },
  "repurposing": { "queued": 3, "in_progress": 2, "completed_this_month": 15 },
  "distribution": { "scheduled_this_week": 8, "sent_this_week": 12 },
  "inbound": { "new": 5, "this_month": 23, "conversion_rate": 0.35 },
  "mailing_list": { "total_active": 4100, "growth_this_month": 15 }
}
```

---

## 10. Agent Bridge API

### `GET /api/agents/jobs`
List all AI jobs.

### `POST /api/agents/repurpose`
Shortcut: submit repurposing job (alias for POST /api/repurposing).

### `GET /api/agents/stats`
AI usage statistics (token usage, costs, success rate).

---

## 11. Error Handling

All API routes follow consistent error handling:

```typescript
// Success
return Response.json({ data: result })

// Error
return Response.json(
  { error: "Not found", details: "Content piece not found" },
  { status: 404 }
)
```

**Standard HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad request (validation error)
- 404: Not found
- 500: Internal server error

---

## 12. Route File Structure

```
src/app/api/
├── content/
│   ├── route.ts          (GET list, POST create)
│   └── [id]/
│       └── route.ts      (GET, PATCH, DELETE)
├── campaigns/
│   ├── route.ts          (GET list, POST create)
│   └── [id]/
│       ├── route.ts      (GET, PATCH, DELETE)
│       ├── content/
│       │   └── route.ts  (POST link, DELETE unlink)
│       └── contacts/
│           └── route.ts  (POST add contacts)
├── repurposing/
│   ├── route.ts          (GET list, POST create)
│   ├── batch/
│   │   └── route.ts      (POST batch create)
│   ├── chains/
│   │   └── [source_id]/
│   │       └── route.ts  (GET chain)
│   └── [id]/
│       ├── route.ts      (PATCH update)
│       ├── execute/
│       │   └── route.ts  (POST trigger AI)
│       └── publish/
│           └── route.ts  (POST publish)
├── distribution/
│   ├── route.ts          (GET list, POST create)
│   ├── calendar/
│   │   └── route.ts      (GET calendar view)
│   └── [id]/
│       ├── route.ts      (PATCH update)
│       └── send/
│           └── route.ts  (POST trigger send)
├── mailing-list/
│   ├── route.ts          (GET list, POST create)
│   ├── import/
│   │   └── route.ts      (POST bulk import)
│   ├── segments/
│   │   └── route.ts      (GET segments)
│   ├── stats/
│   │   └── route.ts      (GET stats)
│   └── [id]/
│       └── route.ts      (PATCH, DELETE)
├── inbound/
│   ├── route.ts          (GET list, POST create)
│   ├── pipeline/
│   │   └── route.ts      (GET pipeline summary)
│   └── [id]/
│       └── route.ts      (PATCH update)
├── templates/
│   ├── route.ts          (GET list, POST create)
│   └── [id]/
│       ├── route.ts      (PATCH, DELETE)
│       └── generate/
│           └── route.ts  (POST AI generate)
├── dashboard/
│   └── stats/
│       └── route.ts      (GET dashboard stats)
└── agents/
    ├── jobs/
    │   └── route.ts      (GET AI jobs)
    ├── stats/
    │   └── route.ts      (GET AI stats)
    └── repurpose/
        └── route.ts      (POST shortcut)
```

**Total: ~30 API route files**

---

*Document generated: 2026-07-20 | Author: NEXUS Agent | Version 2.0*
