CREATE TABLE IF NOT EXISTS app_records (
  kind TEXT NOT NULL, id TEXT NOT NULL, owner_id TEXT NOT NULL REFERENCES members(id),
  scope TEXT NOT NULL DEFAULT '', revision INTEGER NOT NULL, deleted INTEGER NOT NULL DEFAULT 0,
  payload_id TEXT NOT NULL, updated_at INTEGER NOT NULL,
  PRIMARY KEY(kind,id)
);
CREATE TABLE IF NOT EXISTS app_payloads (
  payload_id TEXT NOT NULL, part INTEGER NOT NULL, data TEXT NOT NULL,
  PRIMARY KEY(payload_id,part)
);
CREATE TABLE IF NOT EXISTS app_commits (
  id TEXT PRIMARY KEY, member_id TEXT NOT NULL REFERENCES members(id), signature TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS app_records_owner ON app_records(owner_id,kind);
