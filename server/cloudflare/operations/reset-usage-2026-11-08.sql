-- One-time operator operation explicitly requested on 2026-11-08.
-- Club usage counters only: no members, kiosk, posts, CMS or sponsor data.
DELETE FROM usage_nc_events;
DELETE FROM usage_nc_sessions;
DELETE FROM usage_nc_uniques;
DELETE FROM usage_nc_pages;
DELETE FROM usage_nc_page_months;
DELETE FROM usage_nc_page_years;
DELETE FROM usage_nc_totals;
DELETE FROM usage_events;
DELETE FROM usage_uniques;
DELETE FROM usage_pages;
DELETE FROM usage_totals;
DELETE FROM usage_meta;
INSERT INTO usage_meta(key,value) SELECT key,strftime('%Y-%m-%dT%H:%M:%fZ','now') FROM (SELECT 'simple_enabled_at' key UNION ALL SELECT 'splash_started_at' UNION ALL SELECT 'audience_split_started_at' UNION ALL SELECT 'reset_at');
