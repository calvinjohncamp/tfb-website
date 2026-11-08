-- Separate measurement series: retain the earlier opt-in aggregates as an archive.
CREATE TABLE IF NOT EXISTS usage_nc_totals (period TEXT PRIMARY KEY,views INTEGER NOT NULL DEFAULT 0,visitors INTEGER NOT NULL DEFAULT 0,visits INTEGER NOT NULL DEFAULT 0,members INTEGER NOT NULL DEFAULT 0,app_views INTEGER NOT NULL DEFAULT 0,member_views INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS usage_nc_events (id TEXT PRIMARY KEY,claim TEXT NOT NULL,expires INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS usage_nc_expiry ON usage_nc_events(expires);
CREATE TABLE IF NOT EXISTS usage_nc_uniques (period TEXT NOT NULL,kind TEXT NOT NULL CHECK(kind IN ('visitors','visits','members')),key TEXT NOT NULL,PRIMARY KEY(period,kind,key));
CREATE TABLE IF NOT EXISTS usage_nc_sessions (key TEXT PRIMARY KEY,day TEXT NOT NULL,visit TEXT NOT NULL,last_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS usage_nc_pages (day TEXT NOT NULL,page TEXT NOT NULL,views INTEGER NOT NULL DEFAULT 0,member_views INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(day,page));
CREATE TRIGGER IF NOT EXISTS usage_nc_unique_count AFTER INSERT ON usage_nc_uniques BEGIN
 UPDATE usage_nc_totals SET visitors=visitors+(NEW.kind='visitors'),visits=visits+(NEW.kind='visits'),members=members+(NEW.kind='members') WHERE period=NEW.period;
 UPDATE usage_nc_totals SET visitors=visitors+(NEW.kind='visitors'),visits=visits+(NEW.kind='visits') WHERE period=substr(NEW.period,1,7) AND length(NEW.period)=10 AND NEW.kind IN ('visitors','visits');
END;
