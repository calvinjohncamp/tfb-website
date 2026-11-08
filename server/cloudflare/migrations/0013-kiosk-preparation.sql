-- Preparation only. Every entry is demonstration data. No payment processing.
CREATE TABLE IF NOT EXISTS kiosk_entries(id TEXT PRIMARY KEY,member_id TEXT NOT NULL,member_name TEXT NOT NULL,product_id TEXT NOT NULL,product_name TEXT NOT NULL,detail TEXT NOT NULL DEFAULT '',section_id TEXT NOT NULL DEFAULT '',section_name TEXT NOT NULL DEFAULT '',unit TEXT NOT NULL DEFAULT 'Stück',product_kind TEXT NOT NULL DEFAULT 'unknown',price_cents INTEGER NOT NULL CHECK(price_cents>=0),created_at TEXT NOT NULL,mode TEXT NOT NULL DEFAULT 'demo' CHECK(mode='demo'),origin TEXT NOT NULL DEFAULT 'tfb',basis TEXT NOT NULL DEFAULT 'server');
CREATE INDEX IF NOT EXISTS kiosk_entry_member_date ON kiosk_entries(member_id,created_at);
CREATE INDEX IF NOT EXISTS kiosk_entry_date ON kiosk_entries(created_at);
CREATE TABLE IF NOT EXISTS kiosk_adjustments(id TEXT PRIMARY KEY,entry_id TEXT NOT NULL REFERENCES kiosk_entries(id),amount_cents INTEGER NOT NULL CHECK(amount_cents>0),reason TEXT NOT NULL,actor_id TEXT NOT NULL,created_at TEXT NOT NULL,source TEXT NOT NULL CHECK(source IN ('undo','admin')));
CREATE INDEX IF NOT EXISTS kiosk_adjustment_entry ON kiosk_adjustments(entry_id);
CREATE TRIGGER IF NOT EXISTS kiosk_adjustment_limit BEFORE INSERT ON kiosk_adjustments WHEN NOT EXISTS(SELECT 1 FROM kiosk_adjustments WHERE id=NEW.id) BEGIN SELECT CASE WHEN NEW.amount_cents+COALESCE((SELECT SUM(amount_cents) FROM kiosk_adjustments WHERE entry_id=NEW.entry_id),0)>(SELECT price_cents FROM kiosk_entries WHERE id=NEW.entry_id) THEN RAISE(ABORT,'KIOSK_CREDIT_EXCEEDS_PURCHASE') END; END;
CREATE TABLE IF NOT EXISTS kiosk_catalog_history(id TEXT PRIMARY KEY,actor_id TEXT NOT NULL,created_at TEXT NOT NULL,payload TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS kiosk_statements(id TEXT PRIMARY KEY,member_id TEXT NOT NULL,month TEXT NOT NULL,version INTEGER NOT NULL,fingerprint TEXT NOT NULL,total_cents INTEGER NOT NULL,created_at TEXT NOT NULL,actor_id TEXT NOT NULL,payload TEXT NOT NULL,UNIQUE(member_id,month,fingerprint),UNIQUE(member_id,month,version));
CREATE INDEX IF NOT EXISTS kiosk_statement_member_month ON kiosk_statements(member_id,month);
CREATE TRIGGER IF NOT EXISTS kiosk_entries_no_update BEFORE UPDATE ON kiosk_entries BEGIN SELECT RAISE(ABORT,'KIOSK_HISTORY_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS kiosk_entries_no_delete BEFORE DELETE ON kiosk_entries BEGIN SELECT RAISE(ABORT,'KIOSK_HISTORY_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS kiosk_adjustments_no_update BEFORE UPDATE ON kiosk_adjustments BEGIN SELECT RAISE(ABORT,'KIOSK_HISTORY_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS kiosk_adjustments_no_delete BEFORE DELETE ON kiosk_adjustments BEGIN SELECT RAISE(ABORT,'KIOSK_HISTORY_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS kiosk_catalog_history_no_update BEFORE UPDATE ON kiosk_catalog_history BEGIN SELECT RAISE(ABORT,'KIOSK_HISTORY_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS kiosk_catalog_history_no_delete BEFORE DELETE ON kiosk_catalog_history BEGIN SELECT RAISE(ABORT,'KIOSK_HISTORY_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS kiosk_statements_no_update BEFORE UPDATE ON kiosk_statements BEGIN SELECT RAISE(ABORT,'KIOSK_HISTORY_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS kiosk_statements_no_delete BEFORE DELETE ON kiosk_statements BEGIN SELECT RAISE(ABORT,'KIOSK_HISTORY_IMMUTABLE'); END;
-- Preserve all existing demonstration purchases, including inactive accounts.
-- Historical labels/prices/dates are authoritative; unavailable old category/unit
-- details remain unknown, not reconstructed from today's catalogue.
INSERT OR IGNORE INTO kiosk_entries(id,member_id,member_name,product_id,product_name,price_cents,created_at,basis)
SELECT r.id,r.owner_id,COALESCE(m.first_name||' '||m.last_name,'Ehemaliges Mitglied'),json_extract(p.data,'$.productId'),json_extract(p.data,'$.productName'),json_extract(p.data,'$.priceCents'),json_extract(p.data,'$.createdAt'),'legacy-demo'
FROM app_records r JOIN app_payloads p ON p.payload_id=r.payload_id AND p.part=0 LEFT JOIN members m ON m.id=r.owner_id WHERE r.kind='item' AND r.deleted=0;
INSERT OR IGNORE INTO kiosk_adjustments(id,entry_id,amount_cents,reason,actor_id,created_at,source)
SELECT 'undo:'||e.id,e.id,e.price_cents,'Übernommene Rücknahme; ursprünglicher Rücknahmezeitpunkt nicht gespeichert',e.member_id,strftime('%Y-%m-%dT%H:%M:%fZ',r.updated_at/1000.0,'unixepoch'),'undo' FROM kiosk_entries e JOIN app_records r ON r.id=e.id AND r.kind='item' JOIN app_payloads p ON p.payload_id=r.payload_id AND p.part=0 WHERE json_extract(p.data,'$.status')='cancelled' AND e.price_cents>0;

INSERT OR IGNORE INTO kiosk_catalog_history SELECT 'baseline:'||r.revision,'system',strftime('%Y-%m-%dT%H:%M:%fZ',r.updated_at/1000.0,'unixepoch'),p.data FROM app_records r JOIN app_payloads p ON p.payload_id=r.payload_id AND p.part=0 WHERE r.kind='catalog' AND r.id='club' AND r.deleted=0;

CREATE TABLE IF NOT EXISTS kiosk_messages(id TEXT PRIMARY KEY,entry_id TEXT NOT NULL REFERENCES kiosk_entries(id),member_id TEXT NOT NULL,author_id TEXT NOT NULL,parent_id TEXT,kind TEXT NOT NULL CHECK(kind IN ('question','reply')),text TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS kiosk_message_entry ON kiosk_messages(entry_id,created_at);
CREATE TRIGGER IF NOT EXISTS kiosk_messages_no_update BEFORE UPDATE ON kiosk_messages BEGIN SELECT RAISE(ABORT,'KIOSK_HISTORY_IMMUTABLE'); END;
CREATE TRIGGER IF NOT EXISTS kiosk_messages_no_delete BEFORE DELETE ON kiosk_messages BEGIN SELECT RAISE(ABORT,'KIOSK_HISTORY_IMMUTABLE'); END;
