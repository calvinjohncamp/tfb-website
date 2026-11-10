// Shared multi-word search. Every word must occur; headline matches rank first.
(() => {
  const normalize = value => String(value ?? '').toLocaleLowerCase('de-DE')
    .normalize('NFD').replace(/\p{M}/gu, '').replace(/ß/g, 'ss')
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
  const aliases = text => text.replace(/\b(?:tennisfreunde|tf) bielstein\b/g, 'tfb');
  const index = value => {
    const text = normalize(value);
    const canonical = aliases(text);
    return canonical === text ? text : text + ' ' + canonical;
  };
  function compile(query) {
    const phrase = aliases(normalize(query));
    const words = [...new Set(phrase.split(' ').filter(Boolean))];
    return {
      matches: value => { const text = index(value); return words.every(word => text.includes(word)); },
      score: title => {
        if (!words.length) return 0;
        const text = index(title), count = words.filter(word => text.includes(word)).length;
        const exact = normalize(title).includes(phrase) || aliases(normalize(title)).includes(phrase);
        return (count === words.length ? 100 : 0) + (exact ? 20 : 0) + count;
      },
    };
  }
  const plain = html => {
    const template = document.createElement('template'); template.innerHTML = html || '';
    template.content.querySelectorAll('script,style').forEach(node => node.remove());
    template.content.querySelectorAll('p,div,section,article,h1,h2,h3,h4,li,br,tr,td,summary,blockquote').forEach(node => node.before(document.createTextNode(' ')));
    return template.content.textContent || '';
  };
  TFB.search = { normalize, index, compile, plain };
})();
