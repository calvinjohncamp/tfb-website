-- Aggregate usage only; no IPs, raw browser IDs, URLs or click trails.
CREATE TABLE IF NOT EXISTS usage_meta (key TEXT PRIMARY KEY,value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS usage_events (id TEXT PRIMARY KEY,claim TEXT NOT NULL,expires INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS usage_events_expiry ON usage_events(expires);
CREATE TABLE IF NOT EXISTS usage_totals (
 period TEXT PRIMARY KEY, views INTEGER NOT NULL DEFAULT 0, visitors INTEGER NOT NULL DEFAULT 0,
 visits INTEGER NOT NULL DEFAULT 0, members INTEGER NOT NULL DEFAULT 0, app_views INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS usage_uniques (period TEXT NOT NULL,kind TEXT NOT NULL CHECK(kind IN ('visitors','visits','members')),key TEXT NOT NULL,PRIMARY KEY(period,kind,key));
CREATE TABLE IF NOT EXISTS usage_pages (day TEXT NOT NULL,page TEXT NOT NULL,views INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(day,page));
CREATE TRIGGER IF NOT EXISTS usage_unique_count AFTER INSERT ON usage_uniques BEGIN
 UPDATE usage_totals SET visitors=visitors+(NEW.kind='visitors'),visits=visits+(NEW.kind='visits'),members=members+(NEW.kind='members') WHERE period=NEW.period;
END;
