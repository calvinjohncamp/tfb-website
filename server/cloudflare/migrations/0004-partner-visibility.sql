CREATE TABLE IF NOT EXISTS partner_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS partner_events (
  id TEXT PRIMARY KEY, source TEXT NOT NULL CHECK(source IN ('tfb','padel')),
  day TEXT NOT NULL, page TEXT NOT NULL, partner TEXT NOT NULL, slot TEXT NOT NULL,
  kind TEXT NOT NULL CHECK(kind IN ('pageview','display','visible','click')), expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS partner_events_expiry ON partner_events(expires_at);
CREATE TABLE IF NOT EXISTS partner_daily (
  source TEXT NOT NULL, day TEXT NOT NULL, page TEXT NOT NULL, partner TEXT NOT NULL,
  slot TEXT NOT NULL, kind TEXT NOT NULL, total INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(source,day,page,partner,slot,kind)
);
CREATE TRIGGER IF NOT EXISTS partner_count_insert AFTER INSERT ON partner_events BEGIN
  INSERT INTO partner_daily(source,day,page,partner,slot,kind,total)
    VALUES (NEW.source,NEW.day,NEW.page,NEW.partner,NEW.slot,NEW.kind,1)
    ON CONFLICT(source,day,page,partner,slot,kind) DO UPDATE SET total=total+1;
END;
