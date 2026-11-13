CREATE TABLE IF NOT EXISTS meeting_mail (
  id TEXT PRIMARY KEY,
  recipient_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  attempted_at INTEGER NOT NULL DEFAULT 0,
  sent_at INTEGER,
  provider_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
);
CREATE INDEX IF NOT EXISTS meeting_mail_pending ON meeting_mail(status, created_at);
