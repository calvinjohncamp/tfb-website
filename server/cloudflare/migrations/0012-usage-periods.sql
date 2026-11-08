-- Enrich the existing series; do not reset or relabel page views as people.
ALTER TABLE usage_nc_totals ADD COLUMN guest_visitors INTEGER NOT NULL DEFAULT 0;
ALTER TABLE usage_nc_totals ADD COLUMN member_visits INTEGER NOT NULL DEFAULT 0;
ALTER TABLE usage_nc_totals ADD COLUMN member_app_views INTEGER NOT NULL DEFAULT 0;
ALTER TABLE usage_nc_totals ADD COLUMN unclassified_visits INTEGER NOT NULL DEFAULT 0;
ALTER TABLE usage_nc_totals ADD COLUMN unclassified_app_views INTEGER NOT NULL DEFAULT 0;
UPDATE usage_nc_totals SET guest_visitors=MAX(0,visitors-members),member_visits=CASE WHEN member_views=views THEN visits ELSE 0 END,member_app_views=CASE WHEN member_views=views THEN app_views ELSE 0 END,unclassified_visits=CASE WHEN member_views>0 AND member_views<views THEN visits ELSE 0 END,unclassified_app_views=CASE WHEN member_views>0 AND member_views<views THEN app_views ELSE 0 END WHERE length(period)=10;
UPDATE usage_nc_totals SET guest_visitors=COALESCE((SELECT SUM(d.guest_visitors) FROM usage_nc_totals d WHERE length(d.period)=10 AND substr(d.period,1,7)=usage_nc_totals.period),0),member_visits=COALESCE((SELECT SUM(d.member_visits) FROM usage_nc_totals d WHERE length(d.period)=10 AND substr(d.period,1,7)=usage_nc_totals.period),0),member_app_views=COALESCE((SELECT SUM(d.member_app_views) FROM usage_nc_totals d WHERE length(d.period)=10 AND substr(d.period,1,7)=usage_nc_totals.period),0),unclassified_visits=COALESCE((SELECT SUM(d.unclassified_visits) FROM usage_nc_totals d WHERE length(d.period)=10 AND substr(d.period,1,7)=usage_nc_totals.period),0),unclassified_app_views=COALESCE((SELECT SUM(d.unclassified_app_views) FROM usage_nc_totals d WHERE length(d.period)=10 AND substr(d.period,1,7)=usage_nc_totals.period),0) WHERE length(period)=7;
INSERT OR IGNORE INTO usage_nc_totals(period,views,visitors,visits,members,app_views,member_views,guest_visitors,member_visits,member_app_views,unclassified_visits,unclassified_app_views) SELECT substr(period,1,4),SUM(views),SUM(visitors),SUM(visits),0,SUM(app_views),SUM(member_views),SUM(guest_visitors),SUM(member_visits),SUM(member_app_views),SUM(unclassified_visits),SUM(unclassified_app_views) FROM usage_nc_totals WHERE length(period)=7 GROUP BY substr(period,1,4);
CREATE TABLE IF NOT EXISTS usage_nc_page_months (month TEXT NOT NULL,page TEXT NOT NULL,views INTEGER NOT NULL DEFAULT 0,member_views INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(month,page));
CREATE TABLE IF NOT EXISTS usage_nc_page_years (year TEXT NOT NULL,page TEXT NOT NULL,views INTEGER NOT NULL DEFAULT 0,member_views INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(year,page));
INSERT OR IGNORE INTO usage_nc_page_months SELECT substr(day,1,7),page,SUM(views),SUM(member_views) FROM usage_nc_pages GROUP BY substr(day,1,7),page;
INSERT OR IGNORE INTO usage_nc_page_years SELECT substr(day,1,4),page,SUM(views),SUM(member_views) FROM usage_nc_pages GROUP BY substr(day,1,4),page;
DROP TRIGGER IF EXISTS usage_nc_unique_count;
CREATE TRIGGER usage_nc_unique_count AFTER INSERT ON usage_nc_uniques BEGIN
 UPDATE usage_nc_totals SET visitors=visitors+(NEW.kind='visitors'),visits=visits+(NEW.kind='visits'),members=members+(NEW.kind='members') WHERE period=NEW.period;
 UPDATE usage_nc_totals SET visitors=visitors+(NEW.kind='visitors'),visits=visits+(NEW.kind='visits') WHERE period IN (substr(NEW.period,1,7),substr(NEW.period,1,4)) AND length(NEW.period)=10 AND NEW.kind IN ('visitors','visits');
END;
INSERT OR IGNORE INTO usage_meta(key,value) VALUES ('audience_split_started_at',strftime('%Y-%m-%dT%H:%M:%SZ','now'));
