-- Run before deploying the worker against an existing database.
-- Actual member/team assignments are private data, never part of this migration.
CREATE TABLE IF NOT EXISTS member_teams (
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  team_key TEXT NOT NULL,
  PRIMARY KEY(member_id, team_key)
);
