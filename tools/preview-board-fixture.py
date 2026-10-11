"""Isolated browser QA with fictional family members; never use for hosting."""
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'server'))
import membership_server as m

FIXTURE = '''
const fixtureDb = JSON.parse(localStorage.getItem('tfb_kiosk_demo_v1'));
fixtureDb.members.find(m => m.id === 'm1').email = 'family@example.org';
fixtureDb.members.find(m => m.id === 'm-j1').email = 'family@example.org';
if (!fixtureDb.accounts.some(a => a.memberId === 'm-demo')) fixtureDb.accounts.push({memberId:'m-demo'});
if (!fixtureDb.accounts.some(a => a.memberId === 'm-j1')) fixtureDb.accounts.push({memberId:'m-j1'});
const adult = fixtureDb.accounts.find(a => a.memberId === 'm1');
adult.avatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aQWQAAAAASUVORK5CYII=';
adult.photoPublic = true;
const junior = fixtureDb.accounts.find(a => a.memberId === 'm-j1');
junior.avatar = adult.avatar;
junior.photoPending = {parentName:'Test Parent',parentEmail:'parent@example.org',scopes:['members'],revision:0,version:'tfb-fotos-v1'};
localStorage.setItem('tfb_kiosk_demo_v1', JSON.stringify(fixtureDb));
localStorage.setItem('tfb_kiosk_demo_session_v1','m-demo');
'''


class FixtureHandler(m.Handler):
    def do_GET(self):
        if self.path.split('?')[0] == '/assets/js/demo-backend.js':
            script = (m.ROOT / 'assets/js/demo-backend.js').read_text()
            return self.reply(200, script + '\n' + FIXTURE + '\n' + script, 'application/javascript')
        return super().do_GET()


if __name__ == '__main__':
    cfg = json.loads((m.ROOT / 'server/membership-settings.example.json').read_text())
    server = m.make_server(8788, cfg, '/tmp/tfb-board-fixture')
    server.RequestHandlerClass = FixtureHandler
    print('Isolierte Testvorschau: http://127.0.0.1:8788/', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
