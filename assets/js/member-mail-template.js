// One HTML renderer for the letter preview and its future email output.
(() => {
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const date=value=>!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(value))?'Datum wählen':new Intl.DateTimeFormat('de-DE',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Berlin'}).format(new Date(value+'T12:00:00Z'));
 function html(mail,{editable=false}={}){
  const red=mail.theme==='red',accent=red?'#C4553A':'#FFC300',ink=red?'#171717':'#001D3D';
  const field=(key,tag,style)=>`<${tag}${editable?` contenteditable="false" data-mail-field="${key}" role="textbox" aria-label="${{headline:'Überschrift',salutation:'Anrede',body:'Nachrichtentext',closing:'Gruß und Absender'}[key]}" spellcheck="true"`:''} style="${style};overflow-wrap:anywhere">${escape(mail[key]).replace(/\n/g,'<br>')}</${tag}>`;
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escape(mail.subject)}</title><style>
  @font-face{font-family:'TFB DM Sans';src:url('https://joern-kaemper.de/assets/fonts/editorial/dm-sans.ttf') format('truetype');font-weight:100 1000}
  @font-face{font-family:'TFB Bricolage';src:url('https://joern-kaemper.de/assets/fonts/editorial/bricolage-grotesque.ttf') format('truetype');font-weight:200 800}
  html,body{margin:0!important;padding:0!important;width:100%!important;background:#EFEFEF}table{border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0}img{border:0}p,h1{overflow-wrap:anywhere}
  ${editable?'[contenteditable]{outline:0;border-radius:3px;min-height:1em}[contenteditable]:hover{outline:1px dashed #aaa;outline-offset:5px}[contenteditable]:focus{outline:2px solid '+(red?'#C4553A':'#001D3D')+';outline-offset:5px}':''}
  @media only screen and (max-width:600px){.mm-outer{padding:16px 12px!important}.mm-pad{padding-left:26px!important;padding-right:26px!important}.mm-title{font-size:34px!important;line-height:1.12!important}.mm-logo{width:205px!important;height:auto!important}}
  @media only screen and (max-width:360px){.mm-pad{padding-left:20px!important;padding-right:20px!important}.mm-title{font-size:30px!important}}
  </style><!--[if mso]><style>body,table,td,a,p,h1{font-family:Arial,sans-serif!important}</style><![endif]--></head>
  <body style="background:#EFEFEF;color:#171717;font-family:'TFB DM Sans',Arial,sans-serif;-webkit-text-size-adjust:100%">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#EFEFEF"><tr><td class="mm-outer" align="center" style="padding:28px 16px">
  <!--[if mso]><table role="presentation" width="620"><tr><td><![endif]--><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px">
  <tr><td class="mm-pad" style="padding:20px 40px 24px"><img class="mm-logo" src="https://joern-kaemper.de/${red?'assets/docs/tfb-mail-logo.png':'assets/brand/tfb-logo-midnight-amber.png'}" alt="TFB · Tennisfreunde Bielstein" width="228" style="display:block;width:228px;max-width:100%;height:auto"></td></tr>
  <tr><td style="background:#F9F9F9;border:1px solid #D7D7D7;border-top:3px solid ${accent}"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr><td class="mm-pad" style="padding:32px 40px 36px">
  <p style="margin:0 0 16px;color:#686868;font-size:11px;line-height:1.6;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">${escape(date(mail.date))}</p>
  <div class="mm-title" style="margin:0 0 28px;font-family:'TFB Bricolage','TFB DM Sans',Arial,sans-serif;font-size:43px;line-height:1.08;font-weight:750;letter-spacing:-1.2px;color:${ink}">${field('headline','h1','margin:0;font:inherit;color:inherit')}</div>
  ${field('salutation','p','margin:0 0 18px;font-size:16px;line-height:1.7')}
  ${field('body','p','margin:0 0 28px;font-size:16px;line-height:1.7')}
  ${field('closing','p','margin:0;font-size:16px;line-height:1.7;font-weight:650')}
  </td></tr></table></td></tr>
  <tr><td class="mm-pad" align="center" style="padding:22px 40px 8px"><p style="margin:0 0 5px;color:#686868;font-size:12px;line-height:1.7">Tennisfreunde Bielstein e. V.</p><p style="margin:0;color:#686868;font-size:12px;line-height:1.7"><a href="mailto:info@tfbielstein.de" style="color:#686868;text-decoration:underline">info@tfbielstein.de</a></p></td></tr>
  </table><!--[if mso]></td></tr></table><![endif]--></td></tr></table></body></html>`;
 }
 TFB.memberMailTemplate={html};
})();
