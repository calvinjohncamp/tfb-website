// Canonical renderer for preview and test delivery.
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

 const richKeys=['headline','salutation','body','closing'];
 function normalizeFormatting(formatting,mail){
  if(formatting==null)return undefined;
  if(typeof formatting!=='object'||Array.isArray(formatting)||Object.keys(formatting).some(key=>!richKeys.includes(key)))throw Error('Ungültige Textformatierung.');
  const result={};let total=0;
  for(const key of richKeys){
   if(!Object.hasOwn(formatting,key))continue;
   if(!Array.isArray(formatting[key])||formatting[key].length>2000)throw Error('Die Textformatierung ist zu umfangreich.');
   const runs=[];
   for(const run of formatting[key]){
    if(++total>4000||!run||typeof run!=='object'||Array.isArray(run)||typeof run.text!=='string'||run.text.length>30000||Object.keys(run).some(k=>!['text','bold','italic','signature'].includes(k))||['bold','italic','signature'].some(k=>run[k]!==undefined&&typeof run[k]!=='boolean'))throw Error('Ungültige Textformatierung.');
    const value={text:run.text.replace(/\r\n?/g,'\n').normalize('NFC'),...(run.bold?{bold:true}:{}),...(run.italic?{italic:true}:{}),...(run.signature?{signature:true}:{})};
    if(!value.text)continue;const last=runs.at(-1);
    if(last&&Boolean(last.bold)===Boolean(value.bold)&&Boolean(last.italic)===Boolean(value.italic)&&Boolean(last.signature)===Boolean(value.signature))last.text+=value.text;else runs.push(value);
   }
   if(runs.map(run=>run.text).join('').normalize('NFC')!==String(mail[key]??'').replace(/\r\n?/g,'\n').normalize('NFC'))throw Error('Text und Formatierung stimmen nicht überein.');
   result[key]=runs;
  }
  return result;
 }
 function richHtml(mail,key){
  const runs=mail.formatting?.[key]||[{text:String(mail[key]??''),...(['headline','salutation','closing'].includes(key)?{bold:true}:{})}];
  return runs.map(run=>{
   let value=escape(run.text).replace(/\n/g,'<br>');
   if(run.bold)value=`<strong style="font-weight:${key==='headline'?750:700}">${value}</strong>`;
   if(run.italic)value=`<em style="font-style:italic">${value}</em>`;
   if(run.signature)value=mail.theme==='red'?`<span data-mm-signature="true" style="color:#C4553A">${value}</span>`:`<span data-mm-signature="true" style="background-color:transparent;background-image:url('https://joern-kaemper.de/assets/brand/tfb-highlight-freihand-mail.png');background-size:100% 100%;background-repeat:no-repeat;color:#001D3D;padding:0 .06em;margin:0 -.06em;box-decoration-break:clone;-webkit-box-decoration-break:clone"><!--[if mso]><span style="background-color:#FFE9A2"><![endif]-->${value}<!--[if mso]></span><![endif]--></span>`;
   return value;
  }).join('');
 }
 const date=value=>!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(value))?'Datum wählen':new Intl.DateTimeFormat('de-DE',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Berlin'}).format(new Date(value+'T12:00:00Z'));
 function html(mail,{editable=false}={}){
  const red=mail.theme==='red',accent=red?'#C4553A':'#FFC300',ink=red?'#171717':'#001D3D';
  const field=(key,tag,style)=>{
   const label={headline:'Überschrift',salutation:'Anrede',body:'Nachrichtentext',closing:'Gruß und Absender'}[key];
   const content=`<${tag}${editable?` contenteditable="false" data-mail-field="${key}" role="textbox" aria-label="${label}" spellcheck="true"`:''} style="${style};font-weight:400;overflow-wrap:anywhere">${richHtml(mail,key)}</${tag}>`;
   return editable?`<div class="mm-edit-block" data-mm-key="${key}"><div class="mm-rich-tools" role="toolbar" aria-label="${label} formatieren"><button type="button" data-mm-command="bold" aria-label="Fett: ${label}" aria-pressed="false"><b>B</b></button><button type="button" data-mm-command="italic" aria-label="Kursiv: ${label}" aria-pressed="false"><i>I</i></button><button type="button" class="mm-signature-command" data-mm-command="signature" aria-label="Signature-Farbe: ${label}" aria-pressed="false">${red?'Signature':'Textmarker'}</button></div>${content}</div>`:content;
  };
  return `<!doctype html><html lang="de"><head><meta charset="utf-8">${editable?`<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; font-src https://joern-kaemper.de; img-src https://joern-kaemper.de; base-uri 'none'; form-action 'none'">`:''}<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escape(mail.subject)}</title><style>
  @font-face{font-family:'TFB DM Sans';src:url('https://joern-kaemper.de/assets/fonts/editorial/dm-sans.ttf') format('truetype');font-weight:100 1000}
  @font-face{font-family:'TFB Bricolage';src:url('https://joern-kaemper.de/assets/fonts/editorial/bricolage-grotesque.ttf') format('truetype');font-weight:200 800}
  html,body{margin:0!important;padding:0!important;width:100%!important;background:#EFEFEF}table{border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0}img{border:0}p,h1{overflow-wrap:anywhere}
  ${editable?'.mm-edit-block{position:relative}.mm-rich-tools{display:none;position:absolute;z-index:3;right:0;top:-30px;gap:4px;padding:2px;border-radius:6px;background:#F9F9F9;box-shadow:0 1px 6px #0002;font:12px/1.2 Arial,sans-serif;letter-spacing:0}.mm-edit-block.is-active>.mm-rich-tools,.mm-edit-block:focus-within>.mm-rich-tools{display:flex}.mm-rich-tools button{height:26px;min-width:28px;border:1px solid #D7D7D7;border-radius:4px;background:#fff;color:#171717;padding:0 7px;font:inherit;cursor:pointer}.mm-rich-tools button[aria-pressed=true]{border-color:#171717;box-shadow:inset 0 0 0 1px #171717}.mm-rich-tools .mm-signature-command{'+(red?'color:#C4553A':'background:#FFC300;color:#001D3D')+'}[contenteditable]{outline:0;border-radius:3px;min-height:1em}[contenteditable]:hover{outline:1px dashed #aaa;outline-offset:5px}[contenteditable]:focus{outline:2px solid '+(red?'#C4553A':'#001D3D')+';outline-offset:5px}':''}
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

export { html, richKeys, normalizeFormatting, richHtml };
