PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  member_no TEXT NOT NULL DEFAULT '',
  external_key TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  email2 TEXT NOT NULL DEFAULT '',
  search_text TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)),
  is_admin INTEGER NOT NULL DEFAULT 0 CHECK(is_admin IN (0,1)),
  imported INTEGER NOT NULL DEFAULT 0 CHECK(imported IN (0,1)),
  password_hash TEXT,
  password_salt TEXT,
  activation_hash TEXT UNIQUE,
  activation_expires INTEGER,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS members_email ON members(email);
CREATE INDEX IF NOT EXISTS members_number ON members(member_no);
CREATE TABLE IF NOT EXISTS member_teams (
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  team_key TEXT NOT NULL,
  PRIMARY KEY(member_id, team_key)
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_member ON sessions(member_id);
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
