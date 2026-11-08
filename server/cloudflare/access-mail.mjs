import template from './templates/access-mail.html';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Mail branding is deliberately fixed, independent of a member's selected world.
export const accessMailHtml=code=>template.replaceAll('{{CODE}}',escape(code));
