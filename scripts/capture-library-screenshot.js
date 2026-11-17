import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('docs/screenshots');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getPageTarget(port) {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (res.ok) {
        const list = await res.json();
        const page = list.find((t) => t.type === 'page');
        if (page && page.webSocketDebuggerUrl) return page;
      }
    } catch {
      await sleep(200);
    }
  }
  throw new Error('Could not get page target');
}

class SimpleCDP {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
    });
  }

  async send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function capture() {
  const port = 9225;
  const userDataDir = '/tmp/chrome-lib-' + Date.now();
  const chromeProc = spawn('/opt/google/chrome/chrome', [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-allow-origins=*',
    '--user-data-dir=' + userDataDir,
    '--remote-debugging-port=' + port,
    '--window-size=1280,950',
    'about:blank',
  ]);

  try {
    const pageTarget = await getPageTarget(port);
    const cdp = new SimpleCDP(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    await cdp.send('Page.navigate', { url: 'http://localhost:5173/app/library' });
    await sleep(1500);

    // Set demo student session in sessionStorage and reload
    await cdp.send('Runtime.evaluate', {
      expression: `
        sessionStorage.setItem('gaonlab_demo_session', JSON.stringify({
          name: 'Asha Rao',
          email: 'asha.cbse@gaonlab.demo',
          boardId: 'CBSE',
          boardName: 'Central Board of Secondary Education',
          grade: 8,
          medium: 'en',
          mediumName: 'English',
          subjects: ['Mathematics', 'Science'],
        }));
        window.location.reload();
      `,
    });

    await sleep(3500);
    const ss = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const targetPath = path.join(SCREENSHOT_DIR, 'library-page.png');
    fs.writeFileSync(targetPath, Buffer.from(ss.data, 'base64'));

    const artifactPath = '/home/utkarsh-singh-parihar/.gemini/antigravity/brain/11fe4fcc-daea-4680-9e49-824aa2ee8fc4/screenshots/library-page.png';
    fs.copyFileSync(targetPath, artifactPath);

    console.log('Saved library-page.png:', fs.statSync(targetPath).size, 'bytes');
    cdp.close();
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

capture().catch(console.error);
