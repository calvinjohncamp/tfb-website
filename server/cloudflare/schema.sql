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

CREATE TABLE IF NOT EXISTS partner_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS partner_events (
  id TEXT PRIMARY KEY, source TEXT NOT NULL CHECK(source IN ('tfb','padel')),
  day TEXT NOT NULL, page TEXT NOT NULL, partner TEXT NOT NULL, slot TEXT NOT NULL,
  kind TEXT NOT NULL CHECK(kind IN ('pageview','partner_view','display','visible','click')), expires_at INTEGER NOT NULL
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

CREATE TABLE IF NOT EXISTS tfb_partners (
  id TEXT PRIMARY KEY, revision INTEGER NOT NULL DEFAULT 1,
  payload TEXT NOT NULL CHECK(json_valid(payload)), logo_data TEXT,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS tfb_partner_settings (
  id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL DEFAULT 1,
  payload TEXT NOT NULL CHECK(json_valid(payload)), updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS tfb_partner_payments (
  id TEXT PRIMARY KEY, partner_id TEXT NOT NULL REFERENCES tfb_partners(id),
  year INTEGER NOT NULL, amount_cents INTEGER NOT NULL CHECK(amount_cents>0),
  paid_on TEXT NOT NULL, note TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL,
  voided_at TEXT
);
CREATE INDEX IF NOT EXISTS tfb_partner_payments_year ON tfb_partner_payments(year,partner_id);
CREATE TRIGGER IF NOT EXISTS tfb_premium_limit_insert BEFORE INSERT ON tfb_partners
WHEN json_extract(NEW.payload,'$.active')=1 AND json_extract(NEW.payload,'$.tier')='premium'
BEGIN
 SELECT CASE WHEN (SELECT COUNT(*) FROM tfb_partners WHERE json_extract(payload,'$.active')=1 AND json_extract(payload,'$.tier')='premium' AND id<>NEW.id)>=2 THEN RAISE(ABORT,'Maximal zwei aktive Premium-Partner') END;
END;
CREATE TRIGGER IF NOT EXISTS tfb_premium_limit_update BEFORE UPDATE ON tfb_partners
WHEN json_extract(NEW.payload,'$.active')=1 AND json_extract(NEW.payload,'$.tier')='premium'
BEGIN
 SELECT CASE WHEN (SELECT COUNT(*) FROM tfb_partners WHERE json_extract(payload,'$.active')=1 AND json_extract(payload,'$.tier')='premium' AND id<>NEW.id)>=2 THEN RAISE(ABORT,'Maximal zwei aktive Premium-Partner') END;
END;

-- Regulärer TFB-Partnerbestand.
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES
  ('bmw-kaltenbach-gruppe','{"name":"BMW Kaltenbach Gruppe","tier":"premium","sort":1000,"logo":"assets/partners/premium-bmw-kaltenbach-gruppe.png","url":"https://kaltenbach-gruppe.de/fahrzeuge/bmw-fahrzeuge/","company":"BMW Kaltenbach Gruppe","active":true,"annualCents":30000}',datetime('now')),
  ('safenetworx','{"name":"SafeNetworX","company":"SafeNetworX SNX GmbH","url":"https://www.safenetworx.de","tier":"regional","active":true,"annualCents":30000,"sort":2000,"logo":"assets/partners/tfb-safenetworx.png","contactEmail":"info@safenetworx.de","contactPhone":"02261 9473880","street":"Vollmerhauser Str. 32b","postalCode":"51645","city":"Gummersbach"}',datetime('now')),
  ('sparkasse-gummersbach','{"name":"Sparkasse Gummersbach","company":"Sparkasse Gummersbach","url":"https://www.sparkasse-gm.de","tier":"regional","active":true,"annualCents":30000,"sort":3000,"logo":"assets/partners/tfb-sparkasse-gummersbach.jpg","contactEmail":"","contactPhone":"","street":"Hindenburgstr. 4–8","postalCode":"51643","city":"Gummersbach"}',datetime('now')),
  ('steffen-werkshage','{"name":"Steffen Werkshage","company":"Steffen Werkshage GmbH & Co. KG","url":"https://www.werkshage.de/","tier":"regional","active":true,"annualCents":30000,"sort":4000,"logo":"assets/partners/tfb-steffen-werkshage.png","contactEmail":"info@werkshage.de","contactPhone":"02261 48520","street":"Herweg 37","postalCode":"51702","city":"Bergneustadt"}',datetime('now')),
  ('stubs-dienstleistungen','{"name":"STUBS Dienstleistungen","company":"STUBS Dienstleistungen GmbH & Co. KG","url":"https://www.stubsgmbh.de/","tier":"regional","active":true,"annualCents":30000,"sort":5000,"logo":"assets/partners/tfb-stubs-dienstleistungen.jpg","contactEmail":"","contactPhone":"","street":"Carl-Zeiss-Str. 1","postalCode":"51674","city":"Wiehl"}',datetime('now')),
  ('volksbank-oberberg-eg','{"name":"Volksbank Oberberg eG","company":"Volksbank Oberberg eG","url":"https://www.vb-oberberg.de","tier":"regional","active":true,"annualCents":30000,"sort":6000,"logo":"assets/partners/tfb-volksbank-oberberg-eg.png","contactEmail":"internet@volksbank-oberberg.de","contactPhone":"02262 9840","street":"Bahnhofstraße 3","postalCode":"51674","city":"Wiehl"}',datetime('now')),
  ('aggerenergie','{"name":"AggerEnergie","company":"AggerEnergie GmbH","url":"https://www.aggerenergie.de/","tier":"regional","active":true,"annualCents":30000,"sort":7000,"logo":"assets/partners/tfb-aggerenergie.jpg","contactEmail":"info@aggerenergie.de","contactPhone":"02261 30030","street":"Alexander-Fleming-Str. 2","postalCode":"51643","city":"Gummersbach"}',datetime('now')),
  ('oberberg-partyservice','{"name":"Oberberg Partyservice","company":"Haus Kranenberg, Inh. Christian Kahl","url":"https://partyservice-oberberg.de/","tier":"regional","active":true,"annualCents":30000,"sort":8000,"logo":"assets/partners/tfb-oberberg-partyservice.png","contactEmail":"info@haus-kranenberg.de","contactPhone":"02262 7976598","street":"Bielsteiner Straße 92","postalCode":"51674","city":"Wiehl-Bielstein"}',datetime('now')),
  ('torsten-dehler','{"name":"Württembergische · Torsten Dehler","company":"Versicherungsagentur Torsten Dehler","url":"https://www.wuerttembergische.de/versicherungen/agentur.dehler","tier":"regional","active":true,"annualCents":30000,"sort":9000,"logo":"assets/partners/tfb-torsten-dehler.jpg","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":""}',datetime('now')),
  ('atelier-althoefer','{"name":"Atelier Althöfer · Uhren + Schmuck","company":"Atelier Althöfer","url":"https://www.atelier-althoefer.de/","tier":"regional","active":true,"annualCents":30000,"sort":10000,"logo":"assets/partners/tfb-atelier-althoefer.jpg","contactEmail":"info@atelier-althoefer.de","contactPhone":"02262 707603","street":"Weiherplatz 14","postalCode":"51674","city":"Wiehl"}',datetime('now')),
  ('autohaus-halstenbach','{"name":"Autohaus Halstenbach","company":"Autohaus Halstenbach GmbH","url":"https://www.autohaus-halstenbach.de/","tier":"regional","active":true,"annualCents":30000,"sort":11000,"logo":"assets/partners/tfb-autohaus-halstenbach.jpg","contactEmail":"info@autohaus-halstenbach.de","contactPhone":"02261 73051","street":"Robert-Bosch-Straße 5","postalCode":"51674","city":"Wiehl-Bomig"}',datetime('now')),
  ('schuhmann','{"name":"Schuh Mann","company":"","url":"","tier":"regional","active":true,"annualCents":30000,"sort":12000,"logo":"assets/partners/tfb-schuhmann.png","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":""}',datetime('now')),
  ('sport-hennecken','{"name":"Sport Hennecken","company":"Sport Hennecken, Inh. Torsten Hennecken","url":"https://www.sport-hennecken.de/","tier":"regional","active":true,"annualCents":30000,"sort":13000,"logo":"assets/partners/tfb-sport-hennecken.png","contactEmail":"info@sport-hennecken.de","contactPhone":"02262 752626","street":"Wiesenstraße 1–7","postalCode":"51674","city":"Wiehl"}',datetime('now')),
  ('mueller-klein','{"name":"Müller & Klein","company":"Müller & Klein GmbH & Co. KG","url":"https://www.mueller-klein.de/","tier":"regional","active":true,"annualCents":30000,"sort":14000,"logo":"assets/partners/tfb-mueller-klein.jpg","contactEmail":"info@mueller-klein.de","contactPhone":"02261 9793880","street":"Industriestraße 13","postalCode":"51702","city":"Bergneustadt"}',datetime('now')),
  ('lta','{"name":"LTA","company":"Logistik + Transport Agentur GmbH","url":"https://www.lta-gmbh.de","tier":"regional","active":true,"annualCents":30000,"sort":15000,"logo":"assets/partners/tfb-lta.png","contactEmail":"","contactPhone":"02262 699080","street":"Uelpestraße 21","postalCode":"51674","city":"Wiehl"}',datetime('now')),
  ('metzgerei-muller','{"name":"Metzgerei Müller","company":"Metzgerei Müller, Inh. Herbert Müller","url":"http://www.metzger-mueller.com/","tier":"regional","active":true,"annualCents":30000,"sort":16000,"logo":"assets/partners/tfb-metzgerei-muller.jpg","contactEmail":"lecker@metzger-mueller.com","contactPhone":"02262 2272","street":"Bielsteiner Straße 90","postalCode":"51674","city":"Wiehl"}',datetime('now')),
  ('werner-dieball','{"name":"Dr. Werner Dieball","company":"Dr. Werner Dieball · Souveräne Kommunikation","url":"https://wernerdieball.de","tier":"regional","active":true,"annualCents":30000,"sort":17000,"logo":"assets/partners/tfb-werner-dieball.png","contactEmail":"info@wernerdieball.de","contactPhone":"02262 2083733","street":"Tannhäuserstr. 35","postalCode":"51674","city":"Wiehl"}',datetime('now')),
  ('blumen-schmidt','{"name":"Blumen Schmidt","company":"Blumen Schmidt, Inh. Carolin Cardia","url":"https://www.fleurop.de/partnerfloristen/fleurop-filialen/51674-wiehl/blumen-schmidt-bielsteiner-str-107","tier":"regional","active":true,"annualCents":30000,"sort":18000,"logo":"assets/partners/tfb-blumen-schmidt.png","contactEmail":"blumenschmidtfloristik@gmail.com","contactPhone":"02262 2675","street":"Bielsteiner Str. 107","postalCode":"51674","city":"Wiehl"}',datetime('now')),
  ('sapv-oberberg','{"name":"SAPV Oberberg","company":"SAPV Oberberg GmbH","url":"https://sapv-oberberg.de/","tier":"regional","active":true,"annualCents":30000,"sort":19000,"logo":"assets/partners/tfb-sapv-oberberg.jpg","contactEmail":"","contactPhone":"","street":"Neudieringhauser Str. 64a","postalCode":"51645","city":"Gummersbach"}',datetime('now')),
  ('tanzart-broichhagen','{"name":"TanzART Broichhagen","company":"TanzART Broichhagen, Jana Broichhagen","url":"https://tanzschule-bielstein.de/","tier":"regional","active":true,"annualCents":30000,"sort":20000,"logo":"assets/partners/tfb-tanzart-broichhagen.png","contactEmail":"info@tanzschule-bielstein.de","contactPhone":"02262 7270062","street":"Bielsteiner Straße 88","postalCode":"51674","city":"Wiehl-Bielstein"}',datetime('now')),
  ('pollmann-steuerberater','{"name":"Pollmann Steuerberater","company":"Daniel Pollmann, Steuerberater","url":"https://www.stb-pollmann.de/","tier":"regional","active":true,"annualCents":30000,"sort":21000,"logo":"assets/partners/tfb-pollmann-steuerberater.jpg","contactEmail":"","contactPhone":"02262 7528100","street":"Bielsteiner Str. 88","postalCode":"51674","city":"Wiehl-Bielstein"}',datetime('now')),
  ('oberbantenberger-hof','{"name":"Oberbantenberger Hof · Alt Athen","company":"Restaurant Alt Athen – Oberbantenberger Hof, Alexandros Karalis","url":"http://oberbantenberger-hof.de/","tier":"regional","active":true,"annualCents":30000,"sort":22000,"logo":"assets/partners/tfb-oberbantenberger-hof.png","contactEmail":"info@oberbantenberger-hof.de","contactPhone":"02262 7074541","street":"Oberbantenberger Straße 34","postalCode":"51674","city":"Wiehl"}',datetime('now')),
  ('gsg-grosshandel','{"name":"GSG Farben","company":"GSG Farben Groß- und Einzelhandel GmbH","url":"https://www.gsg-farben.de/","tier":"regional","active":true,"annualCents":30000,"sort":23000,"logo":"assets/partners/tfb-gsg-grosshandel.png","contactEmail":"info@gsg-farben.de","contactPhone":"02261 99060","street":"Albert-Einstein-Straße 11","postalCode":"51674","city":"Wiehl-Bomig"}',datetime('now')),
  ('town-country-haus','{"name":"Town & Country Haus","company":"","url":"https://www.tc.de/","tier":"regional","active":true,"annualCents":30000,"sort":24000,"logo":"assets/partners/tfb-town-country-haus.jpg","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":""}',datetime('now')),
  ('hans-installationen','{"name":"Hans · Installationen und Heizungsbau","company":"Hans GmbH, Installationen und Heizungsbau","url":"https://www.hans-gmbh.com/","tier":"regional","active":true,"annualCents":30000,"sort":25000,"logo":"assets/partners/tfb-hans-installationen.jpg","contactEmail":"info@hans-gmbh.com","contactPhone":"02261 3025780","street":"Werner-von-Siemens-Straße 3","postalCode":"51674","city":"Wiehl-Bomig"}',datetime('now')),
  ('kanzlei-sattler','{"name":"Kanzlei Sattler","company":"Kanzlei Sattler KG Steuerberatungsgesellschaft","url":"https://www.kanzlei-sattler.de/","tier":"regional","active":true,"annualCents":30000,"sort":26000,"logo":"assets/partners/tfb-kanzlei-sattler.jpg","contactEmail":"","contactPhone":"","street":"Bielsteiner Straße 43","postalCode":"51674","city":"Wiehl"}',datetime('now')),
  ('autohaus-schumacher','{"name":"Autohaus Schumacher","company":"Autohaus Werner Schumacher GmbH & Co. KG","url":"https://www.renault-schumacher.de/","tier":"regional","active":true,"annualCents":30000,"sort":27000,"logo":"assets/partners/tfb-autohaus-schumacher.jpg","contactEmail":"","contactPhone":"02261 804750","street":"Am Verkehrskreuz 2","postalCode":"51674","city":"Wiehl"}',datetime('now')),
  ('dornseifer','{"name":"Dornseifers Frischemarkt","company":"","url":"https://www.dornseifer.de/","tier":"regional","active":true,"annualCents":30000,"sort":28000,"logo":"assets/partners/tfb-dornseifer.jpg","contactEmail":"","contactPhone":"","street":"Alte Waldstraße 7","postalCode":"57482","city":"Wenden"}',datetime('now')),
  ('auge-ohr-althofer','{"name":"Auge + Ohr Althöfer","company":"Auge + Ohr Althöfer GmbH & Co. KG","url":"https://www.althoefer.de/","tier":"regional","active":true,"annualCents":30000,"sort":29000,"logo":"assets/partners/tfb-auge-ohr-althofer-padel.png","contactEmail":"","contactPhone":"","street":"Weiherplatz 14","postalCode":"51674","city":"Wiehl"}',datetime('now')),
  ('erzquell-brauerei-bielstein-haas-gmbh-co-kg','{"name":"Zunft Kölsch","company":"Erzquell Brauerei Bielstein Haas GmbH & Co. KG","url":"https://www.zunft-koelsch.de","tier":"regional","active":true,"annualCents":30000,"sort":30000,"logo":"assets/partners/tfb-erzquell-brauerei-bielstein-haas-gmbh-co-kg.jpg","contactEmail":"info@erzquell.de","contactPhone":"02262 820","street":"Bielsteiner Straße 108","postalCode":"51674","city":"Wiehl-Bielstein"}',datetime('now')),
  ('medica-agger-apotheken','{"name":"Medica Apotheke und Agger Apotheke","company":"","url":"https://www.medica-apotheke-gm.de/","tier":"regional","active":true,"annualCents":30000,"sort":31000,"logo":"assets/partners/tfb-medica-agger-apotheken.jpg","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":""}',datetime('now')),
  ('berster-koch','{"name":"Berster Koch","company":"Berster Koch Bauunternehmen GmbH & Co. KG","url":"https://www.bersterkoch.de/","tier":"regional","active":true,"annualCents":30000,"sort":32000,"logo":"assets/partners/tfb-berster-koch.png","contactEmail":"","contactPhone":"","street":"Am Faulenberg 8","postalCode":"51674","city":"Wiehl-Oberbantenberg"}',datetime('now')),
  ('welp-media-service','{"name":"welp media service","company":"welp media service, Annette Welp","url":"https://welp-media-service.de","tier":"regional","active":true,"annualCents":30000,"sort":33000,"logo":"assets/partners/tfb-welp-media-service.jpg","contactEmail":"info@welp-media-service.de","contactPhone":"02262 691553","street":"Dorfstraße 30","postalCode":"51674","city":"Wiehl"}',datetime('now')),
  ('asbach-und-winkler-zurich','{"name":"Zurich · Asbach und Winkler","company":"Asbach und Winkler OHG","url":"https://www.zurich.de/de-de/vor-ort/asbach-winkler","tier":"regional","active":true,"annualCents":30000,"sort":34000,"logo":"assets/partners/tfb-asbach-und-winkler-zurich.jpg","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partner_settings(id,payload,updated_at) VALUES (1,'{"enabled":true,"headline":"Hier spielt","accent":"das Miteinander.","description":"Tennis, Freunde und das Clubleben dazwischen. Willkommen bei den Tennisfreunden Bielstein.","entry":"Zu den Tennisfreunden","foot":"Sport verbindet. Seit 1976 in Bielstein.","partnerLabel":"Präsentiert von unseren Premium-Partnern"}',datetime('now'));

CREATE TABLE IF NOT EXISTS cms_head (id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL DEFAULT 0);
INSERT OR IGNORE INTO cms_head VALUES(1,0);
CREATE TABLE IF NOT EXISTS cms_documents (
 key TEXT PRIMARY KEY, revision INTEGER NOT NULL, payload TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS cms_guards (id TEXT PRIMARY KEY, key TEXT NOT NULL, expected INTEGER NOT NULL);
CREATE TRIGGER IF NOT EXISTS cms_revision_guard BEFORE INSERT ON cms_guards BEGIN
 SELECT CASE WHEN NEW.expected != CASE WHEN NEW.key='@head'
 THEN (SELECT revision FROM cms_head WHERE id=1)
 ELSE COALESCE((SELECT revision FROM cms_documents WHERE key=NEW.key),0) END
 THEN RAISE(ABORT,'CMS_CONFLICT') END;
END;
CREATE TABLE IF NOT EXISTS cms_history (
 id TEXT PRIMARY KEY, revision INTEGER NOT NULL, created_at TEXT NOT NULL, author TEXT NOT NULL,
 label TEXT NOT NULL, kind TEXT NOT NULL, named INTEGER NOT NULL DEFAULT 0, object_key TEXT NOT NULL,
 bucket TEXT NOT NULL DEFAULT ''
);
CREATE UNIQUE INDEX IF NOT EXISTS cms_history_period ON cms_history(kind,bucket) WHERE kind IN ('daily','monthly');
CREATE TABLE IF NOT EXISTS cms_receipts (id TEXT PRIMARY KEY, signature TEXT NOT NULL, result TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS cms_media (
 ref TEXT PRIMARY KEY, hash TEXT NOT NULL, mime TEXT NOT NULL, size INTEGER NOT NULL, object_key TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS cms_public_media (ref TEXT PRIMARY KEY REFERENCES cms_media(ref));
CREATE TABLE IF NOT EXISTS cms_releases (
 commit_id TEXT PRIMARY KEY, object_key TEXT NOT NULL, sha256 TEXT NOT NULL, size INTEGER NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS cms_backup_status (
 id INTEGER PRIMARY KEY CHECK(id=1), last_success TEXT, last_attempt TEXT, last_error TEXT NOT NULL DEFAULT ''
);

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
