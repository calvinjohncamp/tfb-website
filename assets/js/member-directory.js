// Protected directory only; Kiosk, chats and invitations are still browser-local.
(function () {
  const cfg = TFB.config.memberDirectory;
  if (!cfg?.enabled || !cfg.hosts.includes(location.hostname)) return;
  const api = TFB.api;
  const local = { session: api.session.bind(api), signOut: api.signOut.bind(api),
    memberNames: api.memberNames.bind(api), memberAvatars: api.memberAvatars.bind(api) };
  const KEY = 'tfb_directory_token_v1';
  let token = '';
  try { token = localStorage.getItem(KEY) || ''; } catch (_) {}
  if (!token) {
    try { token = sessionStorage.getItem(KEY) || ''; } catch (_) {}
  }

  function rememberToken() {
    try {
      localStorage.setItem(KEY, token);
      sessionStorage.removeItem(KEY);
    } catch (_) {
      try { sessionStorage.setItem(KEY, token); } catch (_) {}
    }
  }
  let verified = null;
  const base = cfg.url.replace(/\/$/, '');
  async function call(path, data, options = {}) {
    if (location.protocol !== 'https:') throw Error('Bitte öffne die Website über https://joern-kaemper.de, um dich sicher anzumelden.');
    const requestToken = token;
    const controller = new AbortController();
    const backupOperation = /^\/admin\/site\/(backup|restore)$/.test(path);
    const timeout = setTimeout(() => controller.abort(), backupOperation ? 120000 : 15000);
    try {
      const response = await fetch(base + path, {
        method: data === undefined ? 'GET' : 'POST', cache: 'no-store', signal: controller.signal,
        headers: { ...(data === undefined ? {} : { 'Content-Type': 'application/json' }),
          ...(requestToken ? { Authorization: 'Bearer ' + requestToken } : {}) },
        ...(data === undefined ? {} : { body: JSON.stringify(data) }),
      });
      if(options.raw && response.ok)return response;
      const value = await response.json();
      if (!response.ok) {
        if (response.status === 401 && requestToken && token === requestToken) clear();
        throw Object.assign(Error(value.error || 'Der Mitgliederzugang ist gerade nicht erreichbar.'),{status:response.status});
      }
      return value;
    } catch (err) {
      if (err.name === 'AbortError' || err instanceof TypeError) throw Error(backupOperation ? 'Die Bestätigung konnte nicht empfangen werden. Bitte den aktuellen Stand prüfen und erneut versuchen.' : 'Der Mitgliederzugang ist gerade nicht erreichbar. Bitte später erneut versuchen.');
      throw err;
    } finally { clearTimeout(timeout); }
  }
  TFB.directoryCall = call;
  TFB.directoryFetch = path => call(path,undefined,{raw:true});
  function clear() {
    try { if (localStorage.getItem(KEY) === token) localStorage.removeItem(KEY); } catch (_) {}
    try { sessionStorage.removeItem(KEY); } catch (_) {}
    token = ''; verified = null; api.disconnectSync?.();
    api.attachDirectoryMember(null);
  }
  async function attachVerified(result, requestToken) {
    if (token !== requestToken) return null;
    verified = result.member;
    const member = api.attachDirectoryMember(verified);
    try {
      const synced = api.connectSync ? await api.connectSync(member) : member;
      return token === requestToken ? synced : null;
    } catch (err) {
      if (token !== requestToken) return null;
      // Profile/content sync may fail independently of successful authentication.
      api.syncError = err.message;
      return member;
    }
  }
  async function accept(result) {
    token = result.token;
    rememberToken();
    return attachVerified(result, token);
  }
  api.secureDirectory = true;
  const authReady=call('/auth/options').then(o=>{api.automaticEmail=Boolean(o.automaticEmail);}).catch(()=>{api.automaticEmail=false;});
  api.requestEmailAccess=(email,memberNo,fullName)=>call('/auth/email/request',{email,memberNo,fullName});
  api.activateEmailAccess=(challengeId,code,password)=>acceptCode(challengeId,code,password);
  async function acceptCode(challengeId,code,password){return accept(await call('/auth/email/activate',{challengeId,code,password}));}
  api.memberAccessOverview=()=>call('/admin/members');

  api.lookupEmail = async () => ({ known: true, hasPassword: true }); // Never disclose membership before login.
  api.signIn = async (identifier, password, fullName) => accept(await call('/auth/login', { identifier, password, fullName }));
  api.createPassword = async (identifier, password, code) => accept(await call('/auth/activate', { identifier, password, code }));
  api.session = async () => {
    await authReady;
    if (!token) { clear(); return null; }
    const requestToken = token;
    let result;
    try {
      result = await call('/auth/session');
    } catch (err) {
      if (token !== requestToken || (err.status && err.status < 500 && err.status !== 429)) return null;
      // A short network interruption during reload must not force a new login.
      try { result = await call('/auth/session'); } catch (_) { return null; }
    }
    if (token !== requestToken) return null;
    rememberToken();
    return attachVerified(result, requestToken);
  };
  let heartbeatBusy=false;
  async function heartbeat(){if(heartbeatBusy||!token||!verified||document.visibilityState==='hidden')return;heartbeatBusy=true;try{await call('/auth/presence',{});}catch{}finally{heartbeatBusy=false;}}
  setInterval(heartbeat,60000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')heartbeat();});
  api.signOut = async () => { try { if(token) await call('/auth/logout', {}); } finally { clear(); await local.signOut(); } };
  window.addEventListener('storage', event => {
    if (event.storageArea === localStorage && (event.key === KEY || event.key === null) && token && event.newValue !== token) {
      try { sessionStorage.removeItem(KEY); } catch (_) {}
      location.reload();
    }
  });
  api.searchMembers = query => call('/members/search?q=' + encodeURIComponent(query));
  api.memberNames = async ids => {
    const unique=[...new Set(ids)]; const result={};
    for(let i=0;i<unique.length;i+=100)Object.assign(result,await call('/members/names',{ids:unique.slice(i,i+100)}));
    // Only fictional m1/m-demo records may be resolved from the local simulation.
    const demoIds=unique.filter(id=>/^m(?:-demo|\d+)$/.test(id));
    if(demoIds.length)Object.assign(result,await local.memberNames(demoIds));
    return result;
  };
  api.memberAvatars = async ids => local.memberAvatars(ids.filter(id=>id===verified?.id || /^m(?:-demo|\d+)$/.test(id)));
  api.allMemberIds = async () => { throw Error('Die vollständige Mitgliederliste wird nicht an den Browser ausgeliefert.'); };
  api.memberListInfo = () => call('/admin/info');
  api.importMembers = (rows, { apply = false } = {}) => call('/admin/import', { rows, apply });
})();
