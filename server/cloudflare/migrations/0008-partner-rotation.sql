-- Existing TFB club partners enter the regional tier; BMW retains premium.
UPDATE tfb_partners
SET payload=json_set(payload,'$.tier','regional'), revision=revision+1, updated_at=datetime('now')
WHERE json_extract(payload,'$.tier')='partner';

UPDATE tfb_partners
SET payload=json_set(payload,'$.logo','assets/partners/tfb-auge-ohr-althofer-padel.png'),
    logo_data=NULL, revision=revision+1, updated_at=datetime('now')
WHERE id='auge-ohr-althofer';
