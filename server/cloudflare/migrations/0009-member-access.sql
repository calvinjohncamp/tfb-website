-- Additive member access metadata; no existing accounts or sessions are changed.
CREATE TABLE IF NOT EXISTS member_access (
 member_id TEXT PRIMARY KEY REFERENCES members(id),
 first_login_at INTEGER,
 last_login_at INTEGER,
 last_seen_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS member_login_challenges (
 id TEXT PRIMARY KEY,
 member_id TEXT REFERENCES members(id),
 email TEXT NOT NULL,
 code_hash TEXT NOT NULL,
 created_at INTEGER NOT NULL,
 expires_at INTEGER NOT NULL,
 attempts INTEGER NOT NULL DEFAULT 0,
 consumed_at INTEGER
);
CREATE INDEX IF NOT EXISTS member_login_challenges_email ON member_login_challenges(email,created_at);
