// Load the canonical browser/server email renderer when the admin opens a letter.
TFB.loadMemberMailTemplate=()=>TFB.memberMailTemplateReady ||= import('./member-mail-renderer.mjs?v=20261110-mail-formatting-1').then(module=>TFB.memberMailTemplate=module);
