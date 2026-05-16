# Stage 1
## REST API Endpoints
### Get Notifications
GET /api/notifications

Headers:
Authorization: Bearer token

Response:
```json
{
  "notifications": [
    {
      "id": "123",
      "type": "Placement",
      "message": "Amazon hiring",
      "timestamp": "2026-05-16 08:14:28"
    }
  ]
}
```

### Mark Notification Read
PUT /api/notifications/{id}/read

Response:
```json
{
  "message": "Notification marked as read"
}
```

### Delete Notification
DELETE /api/notifications/{id}

Response:
```json
{
  "message": "Notification deleted"
}
```

## Real-Time Notification Mechanism

Use WebSockets for instant notification delivery.

Benefits:
- Real-time updates
- Reduced API polling
- Better user experience

---

# Stage 2

## Database Choice

Recommended DB: PostgreSQL

Reason:
- Strong consistency
- Fast indexing
- Supports large notification datasets
- Reliable transactions

## Schema

Students Table:
- student_id
- name
- email

Notifications Table:
- id
- student_id
- type
- message
- is_read
- created_at

## Problems with Growth
- Slow queries
- High storage usage
- Heavy DB load

## Solutions
- Indexing
- Partitioning
- Archiving old notifications
- Caching

---

# Stage 3

Problem query:

SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC;

Issues:
- SELECT *
- Missing indexes
- Full table scan

Optimized query:

SELECT id, type, message, createdAt
FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC
LIMIT 50;

Index:

CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt DESC);

---

# Stage 4

Performance Improvements:

1. Redis Caching
- Faster repeated reads
- Less DB load

2. Pagination
- Fetch limited records
- Faster response

3. WebSockets
- Avoid frequent polling

4. Background Processing
- Async notification delivery

Tradeoffs:
- Extra infrastructure
- Cache invalidation complexity

---

# Stage 5

Problems:
- Sequential processing
- Slow email sending
- Failure handling issue
- No retry mechanism

Better Design:
- Save notification first
- Push tasks to queue
- Worker handles email sending
- Retry failed emails

Pseudo code:

function notify_all(student_ids, message):
    save_notifications_to_db()
    push_email_jobs_to_queue()
    push_app_notifications()

Benefits:
- Faster
- Reliable
- Retry support
- Scalable

---

# Stage 6

Priority logic:
Placement > Result > Event

Implementation:
- Placement weight = 3
- Result weight = 2
- Event weight = 1

Recent notifications get higher score.

Algorithm:
score = priority_weight + recency_score

Top 10 notifications sorted by highest score.