"""Run isolated functional and browser suites with their own local preview server."""
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from datetime import datetime, timezone
import json, os, signal, subprocess, threading, time

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '.private' / 'test-runs' / datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
OUT.mkdir(parents=True)
class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT)))
thread = threading.Thread(target=server.serve_forever, daemon=True)
thread.start()
env = dict(os.environ, TFB_TEST_SITE_URL='http://127.0.0.1:' + str(server.server_port))
units = sorted(str(p.relative_to(ROOT)) for p in (ROOT / 'tools').glob('test-*.mjs') if not p.name.startswith('test-browser-'))
jobs = [('unit', ['node', '--test', *units]),
        ('public-export', ['python3', 'tools/test-public-content.py']),
        ('membership', ['python3', '-m', 'unittest', 'discover', '-s', 'server', '-p', 'test_*.py'])]
# partner-visibility is a historical alias of partner-management, avoid duplicate execution.
jobs += [(p.stem, ['node', str(p.relative_to(ROOT))]) for p in sorted((ROOT / 'tools').glob('test-browser-*.mjs')) if p.name != 'test-browser-partner-visibility.mjs']
results = []
try:
    for name, command in jobs:
        start = time.monotonic()
        with (OUT / (name + '.log')).open('w') as log:
            process = subprocess.Popen(command, cwd=ROOT, env=env, stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
            try:
                code = process.wait(timeout=180)
            except subprocess.TimeoutExpired:
                os.killpg(process.pid, signal.SIGTERM)
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    os.killpg(process.pid, signal.SIGKILL)
                    process.wait()
                code = 'timeout'
        result = dict(name=name, exit=code, seconds=round(time.monotonic()-start, 1))
        results.append(result)
        (OUT / 'results.json').write_text(json.dumps(results, indent=2) + '\n')
        print(('PASS ' if code == 0 else 'FAIL ') + name, flush=True)
finally:
    server.shutdown()
    server.server_close()
    thread.join()
failed = [r['name'] for r in results if r['exit'] != 0]
print(json.dumps(dict(suites=len(results), passed=len(results)-len(failed), failed=failed, logs=str(OUT))), flush=True)
raise SystemExit(bool(failed))
