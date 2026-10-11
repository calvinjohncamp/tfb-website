// Reuse each field's upload handler, including its limits, resizing and permissions.
(function () {
  const selector = 'input[type="file"][accept*="image/"]';
  let highlighted = null;
  let internalDrag = false;
  const toast = message => TFB.ui?.toast(message);
  function targetField(target) {
    let node = target?.nodeType === 1 ? target : target?.parentElement;
    while (node && node !== document.body && node.tagName !== 'FORM') {
      const inputs = [...node.querySelectorAll(selector)].filter(input => !input.disabled);
      if (inputs.length === 1) return { zone: node, input: inputs[0] };
      if (inputs.length > 1) return null;
      node = node.parentElement;
    }
    return null;
  }
  function clear() {
    highlighted?.classList.remove('photo-drop-active');
    highlighted = null;
  }
  function external(transfer) {
    return transfer && [...transfer.types].some(type => type === 'Files' || /filepromise|file-url/i.test(type));
  }
  function accepted(file, input) {
    const image = file.type.startsWith('image/') || (!file.type && /\.(jpe?g|png|webp|gif|heic|heif|avif|tiff?|bmp)$/i.test(file.name));
    const pdf = /application\/pdf/.test(input.accept) && (file.type === 'application/pdf' || (!file.type && /\.pdf$/i.test(file.name)));
    return image || pdf;
  }
  document.addEventListener('dragstart', () => { internalDrag = true; }, true);
  document.addEventListener('dragover', event => {
    if (internalDrag || !external(event.dataTransfer)) return;
    event.preventDefault();
    const field = targetField(event.target);
    if (highlighted !== field?.zone) clear();
    if (field) {
      highlighted = field.zone;
      highlighted.classList.add('photo-drop-active');
    }
    event.dataTransfer.dropEffect = field ? 'copy' : 'none';
  }, true);
  document.addEventListener('dragleave', event => {
    if (highlighted && !highlighted.contains(event.relatedTarget)) clear();
  }, true);
  document.addEventListener('dragend', () => { internalDrag = false; clear(); }, true);
  document.addEventListener('drop', event => {
    if (internalDrag) { internalDrag = false; clear(); return; }
    if (!external(event.dataTransfer)) return;
    event.preventDefault();
    event.stopPropagation();
    const field = targetField(event.target);
    clear();
    if (!field) { toast('Bitte die Fotos direkt in ein Foto-Feld ziehen.'); return; }
    let files = [...event.dataTransfer.files];
    if (!files.length) files = [...(event.dataTransfer.items || [])].filter(item => item.kind === 'file').map(item => item.getAsFile()).filter(Boolean);
    if (!files.length) {
      toast('Chrome hat keine Bilddatei erhalten. Bitte die Fotos aus der Foto-App als JPEG exportieren und erneut hineinziehen.');
      return;
    }
    if (files.some(file => !accepted(file, field.input))) { toast('Bitte nur Bilddateien in dieses Foto-Feld ziehen.'); return; }
    if (!field.input.multiple && files.length > 1) { toast('Dieses Foto-Feld nimmt ein einzelnes Bild auf.'); return; }
    try {
      const transfer = new DataTransfer();
      files.forEach(file => transfer.items.add(file));
      field.input.files = transfer.files;
      field.input.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (_) { toast('Die Bilder konnten nicht übernommen werden. Bitte über die Foto-Auswahl erneut versuchen.'); }
  }, true);
})();
