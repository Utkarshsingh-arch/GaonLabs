// Node.js 22 script to capture all 6 requested screenshots using Chrome DevTools Protocol (CDP) via native WebSocket
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('docs/screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

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
        if (page && page.webSocketDebuggerUrl) {
          return page;
        }
      }
    } catch {
      await sleep(250);
    }
  }
  throw new Error('Could not get page target from Chrome');
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
  const port = 9222;
  const userDataDir = '/tmp/chrome-test-profile-' + Date.now();
  const chromeProc = spawn('/opt/google/chrome/chrome', [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-allow-origins=*',
    '--user-data-dir=' + userDataDir,
    '--remote-debugging-port=' + port,
    '--window-size=1280,900',
    'http://localhost:5173/app/library',
  ]);

  try {
    const pageTarget = await getPageTarget(port);
    const cdp = new SimpleCDP(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');
    await cdp.send('Runtime.enable');

    console.log('1. Capturing Library Page...');
    await sleep(3000);
    let ss = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(SCREENSHOT_DIR, 'library-page.png'), Buffer.from(ss.data, 'base64'));

    console.log('2. Navigating to Book Details Page...');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/app/books/sample-id' });
    await sleep(2500);
    ss = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(SCREENSHOT_DIR, 'book-details-page.png'), Buffer.from(ss.data, 'base64'));

    console.log('3. Capturing Chapter Selection & Notice Modal...');
    await cdp.send('Runtime.evaluate', {
      expression: `
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Official Source'));
        if (btn) btn.click();
      `,
    });
    await sleep(1000);
    ss = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(SCREENSHOT_DIR, 'chapter-selection.png'), Buffer.from(ss.data, 'base64'));

    console.log('4. Navigating to In-App PDF Reader...');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/app/reader/doc-forces-and-friction-cl8' });
    await sleep(3500);
    ss = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(SCREENSHOT_DIR, 'pdf-reader.png'), Buffer.from(ss.data, 'base64'));

    console.log('5. Triggering Text Selection Toolbar...');
    await cdp.send('Runtime.evaluate', {
      expression: `
        const spans = Array.from(document.querySelectorAll('.pdf-text-item'));
        if (spans.length > 5) {
          const s1 = spans[3];
          const s2 = spans[6];
          const range = document.createRange();
          range.setStart(s1.firstChild || s1, 0);
          range.setEnd(s2.firstChild || s2, (s2.textContent || '').length);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 450, clientY: 320 }));
        }
      `,
    });
    await sleep(1000);
    ss = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(SCREENSHOT_DIR, 'selected-text-toolbar.png'), Buffer.from(ss.data, 'base64'));

    console.log('6. Triggering Contextual Explanation Popup...');
    await cdp.send('Runtime.evaluate', {
      expression: `
        const explainBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Explain'));
        if (explainBtn) {
          explainBtn.click();
        }
      `,
    });
    await sleep(2000);
    ss = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(SCREENSHOT_DIR, 'explanation-popup.png'), Buffer.from(ss.data, 'base64'));

    cdp.close();
    console.log('All 6 screenshots successfully captured in docs/screenshots/');
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

capture().catch((err) => {
  console.error('Screenshot script failed:', err);
  process.exit(1);
});
