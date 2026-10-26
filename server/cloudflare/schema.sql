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

-- Nur öffentliche Testnamen und leere Kontaktdaten; keine Padel-Vertrags- oder Zahlungsdaten.
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('bmw-kaltenbach-gruppe','{"name":"BMW Kaltenbach Gruppe","tier":"premium","url":"https://kaltenbach-gruppe.de/fahrzeuge/bmw-fahrzeuge/","sort":1000,"logo":"assets/partners/premium-bmw-kaltenbach-gruppe.png","company":"BMW Kaltenbach Gruppe","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('intersport','{"name":"Intersport","tier":"premium","url":"https://www.intersport.de/","sort":2000,"logo":"assets/partners/premium-intersport.jpg","company":"Intersport","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('a-s-creation','{"name":"A.S. Création","tier":"partner","url":"https://www.tapetenshop.de/","sort":0,"logo":"assets/partners/partner-a-s-creation.png","company":"A.S. Création","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('sparkasse-gummersbach','{"name":"Sparkasse Gummersbach","tier":"partner","url":"https://www.sparkasse-gm.de/de/home.html","sort":1000,"logo":"assets/partners/partner-sparkasse-gummersbach.jpg","company":"Sparkasse Gummersbach","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('schwalbe','{"name":"Schwalbe","tier":"partner","url":"https://www.schwalbe.com/","sort":3000,"logo":"assets/partners/partner-schwalbe.png","company":"Schwalbe","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('kanzlei-sattler','{"name":"Kanzlei Sattler","tier":"partner","url":"https://www.kanzlei-sattler.de/","sort":4000,"logo":"assets/partners/partner-kanzlei-sattler.png","company":"Kanzlei Sattler","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('volksbank-oberberg-eg','{"name":"Volksbank Oberberg eG","tier":"partner","url":"https://www.vb-oberberg.de/startseite.html","sort":5000,"logo":"assets/partners/partner-volksbank-oberberg-eg.png","company":"Volksbank Oberberg eG","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('die-finanzmaschine-r-kamper','{"name":"Die Finanzmaschine - R. Kämper","tier":"partner","url":"https://diefinanzmaschine.netlify.app/","sort":6000,"logo":"assets/partners/partner-die-finanzmaschine-r-kamper.png","company":"Die Finanzmaschine - R. Kämper","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('muller-textil-group','{"name":"Müller Textil Group","tier":"partner","url":"https://www.mullertextiles.com/","sort":8000,"logo":"assets/partners/partner-muller-textil-group.png","company":"Müller Textil Group","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('aok','{"name":"AOK","tier":"partner","url":"https://www.aok.de/pk/rh/region/oberbergischer-kreis-krankenkasse/","sort":9000,"logo":"assets/partners/partner-aok.png","company":"AOK","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('aggerenergie','{"name":"AggerEnergie","tier":"partner","url":"https://www.aggerenergie.de/","sort":10000,"logo":"assets/partners/partner-aggerenergie.png","company":"AggerEnergie","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('faulenbach-schmiedetechnik','{"name":"Faulenbach Schmiedetechnik","tier":"partner","url":"https://www.faulenbach-gmbh.de/","sort":11000,"logo":"assets/partners/partner-faulenbach-schmiedetechnik.png","company":"Faulenbach Schmiedetechnik","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('bpw','{"name":"BPW","tier":"partner","url":"","sort":12000,"logo":"assets/partners/partner-bpw.png","company":"BPW","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('sarstedt','{"name":"Sarstedt","tier":"partner","url":"","sort":14000,"logo":"assets/partners/partner-sarstedt.png","company":"Sarstedt","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('wiehl-apotheke','{"name":"Wiehl Apotheke","tier":"partner","url":"https://www.wiehl-apotheke.de/","sort":1000,"logo":"assets/partners/regional-wiehl-apotheke.png","company":"Wiehl Apotheke","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('oberberg-apotheke','{"name":"Oberberg Apotheke","tier":"partner","url":"https://www.oberberg-apotheke.de/","sort":2000,"logo":"assets/partners/regional-oberberg-apotheke.png","company":"Oberberg Apotheke","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('stubs-dienstleistungen','{"name":"STUBS Dienstleistungen","tier":"partner","url":"https://www.stubsgmbh.de/","sort":3000,"logo":"assets/partners/regional-stubs-dienstleistungen.png","company":"STUBS Dienstleistungen","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('fahrzeugpflege-wiehl','{"name":"Fahrzeugpflege Wiehl","tier":"partner","url":"https://www.fahrzeugpflege-wiehl.de/","sort":4000,"logo":"assets/partners/regional-fahrzeugpflege-wiehl.jpg","company":"Fahrzeugpflege Wiehl","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('penz','{"name":"Penz","tier":"partner","url":"https://www.penz.de/","sort":5000,"logo":"assets/partners/regional-penz.png","company":"Penz","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('pollmann-steuerberater','{"name":"Pollmann Steuerberater","tier":"partner","url":"https://www.stb-pollmann.de/","sort":6000,"logo":"assets/partners/regional-pollmann-steuerberater.png","company":"Pollmann Steuerberater","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('gro-bestattungen','{"name":"Groß Bestattungen","tier":"partner","url":"https://gross-bestattungen.de","sort":7000,"logo":"assets/partners/regional-gro-bestattungen.png","company":"Groß Bestattungen","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('erzquell-brauerei-bielstein-haas-gmbh-co-kg','{"name":"Erzquell Brauerei Bielstein Haas GmbH & Co. KG","tier":"partner","url":"https://www.erzquell.de/","sort":8000,"logo":"assets/partners/regional-erzquell-brauerei-bielstein-haas-gmbh-co.png","company":"Erzquell Brauerei Bielstein Haas GmbH & Co. KG","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('auge-ohr-althofer','{"name":"Auge + Ohr Althöfer","tier":"partner","url":"https://www.althoefer.de/","sort":9000,"logo":"assets/partners/regional-auge-ohr-althofer.png","company":"Auge + Ohr Althöfer","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('asbach-und-winkler-zurich','{"name":"Asbach und Winkler - Zurich","tier":"partner","url":"https://www.zurich.de/de-de/vor-ort/asbach-winkler","sort":10000,"logo":"assets/partners/regional-asbach-und-winkler-zurich.png","company":"Asbach und Winkler - Zurich","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('metzgerei-muller','{"name":"Metzgerei Müller","tier":"partner","url":"","sort":11000,"logo":"assets/partners/regional-metzgerei-muller.png","company":"Metzgerei Müller","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('bsv-bielstein','{"name":"BSV Bielstein","tier":"partner","url":"https://www.bsv-bielstein.de/","sort":12000,"logo":"assets/partners/regional-bsv-bielstein.jpg","company":"BSV Bielstein","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('zappo-apotheke','{"name":"zappo Apotheke","tier":"partner","url":"","sort":13000,"logo":"assets/partners/regional-zappo-apotheke.png","company":"zappo Apotheke","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('sapv-oberberg','{"name":"SAPV Oberberg","tier":"partner","url":"https://sapv-oberberg.de/","sort":14000,"logo":"assets/partners/regional-sapv-oberberg.png","company":"SAPV Oberberg","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('jagenberg','{"name":"Jagenberg","tier":"partner","url":"","sort":15000,"logo":"assets/partners/regional-jagenberg.png","company":"Jagenberg","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('sportpark-am-see','{"name":"Sportpark am See","tier":"partner","url":"https://sportparkamsee.de","sort":16000,"logo":"assets/partners/regional-sportpark-am-see.png","company":"Sportpark am See","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('bubenzer-baufachzentrum','{"name":"Bubenzer Baufachzentrum","tier":"partner","url":"","sort":17000,"logo":"assets/partners/regional-bubenzer-baufachzentrum.png","company":"Bubenzer Baufachzentrum","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('5-elemente','{"name":"5 Elemente","tier":"partner","url":"","sort":18000,"logo":"assets/partners/regional-5-elemente.png","company":"5 Elemente","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('aldi-sud','{"name":"ALDI SÜD","tier":"partner","url":"","sort":19000,"logo":"assets/partners/regional-aldi-sud.png","company":"ALDI SÜD","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('seitz','{"name":"Seitz","tier":"partner","url":"","sort":20000,"logo":"assets/partners/regional-seitz.jpg","company":"Seitz","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('piccola-italia','{"name":"Piccola Italia","tier":"partner","url":"","sort":21000,"logo":"assets/partners/regional-piccola-italia.png","company":"Piccola Italia","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('lang-raum-idee','{"name":"LANG Raum+Idee","tier":"partner","url":"","sort":22000,"logo":"assets/partners/regional-lang-raum-idee.png","company":"LANG Raum+Idee","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('gsg-grosshandel','{"name":"GSG Grosshandel","tier":"partner","url":"","sort":23000,"logo":"assets/partners/regional-gsg-grosshandel.png","company":"GSG Grosshandel","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
INSERT OR IGNORE INTO tfb_partners(id,payload,updated_at) VALUES ('coca-cola','{"name":"Coca-Cola","tier":"partner","url":"","sort":24000,"logo":"assets/partners/regional-coca-cola.jpg","company":"Coca-Cola","active":true,"sample":true,"status":"draft","annualCents":30000,"contactName":"","contactEmail":"","contactPhone":"","street":"","postalCode":"","city":"","note":""}',datetime('now'));
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
