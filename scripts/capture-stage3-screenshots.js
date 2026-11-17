import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('docs/screenshots');
const ARTIFACT_DIR = '/home/utkarsh-singh-parihar/.gemini/antigravity/brain/11fe4fcc-daea-4680-9e49-824aa2ee8fc4/screenshots';

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

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

  async captureScreenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const localPath = path.join(SCREENSHOT_DIR, filename);
    const artifactPath = path.join(ARTIFACT_DIR, filename);

    fs.writeFileSync(localPath, buffer);
    fs.writeFileSync(artifactPath, buffer);
    console.log(`📸 Saved screenshot: ${localPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
  }
}

async function main() {
  const chromePort = 9224;
  console.log(`Starting headless Chrome on port ${chromePort}...`);

  const chromeProc = spawn('google-chrome', [
    '--headless=new',
    `--remote-debugging-port=${chromePort}`,
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--window-size=1280,800',
    'about:blank',
  ]);

  try {
    const page = await getPageTarget(chromePort);
    const cdp = new SimpleCDP(page.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');

    console.log('Connected to Chrome DevTools Protocol');

    // 1. Explore STEM Hub Page
    console.log('\n--- 1. Capturing Explore STEM Hub Page ---');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/app/explore' });
    await sleep(2500);
    await cdp.captureScreenshot('explore-stem-page.png');

    // 2. Topic Detail Page - Read Tab (Forces & Friction)
    console.log('\n--- 2. Capturing Topic Detail (Read Tab) ---');
    await cdp.send('Page.navigate', {
      url: 'http://localhost:5173/app/explore/topics/topic-forces-friction-cl8?tab=read',
    });
    await sleep(2500);
    await cdp.captureScreenshot('topic-detail-read.png');

    // 3. Topic Detail Page - Watch Tab (Video Player)
    console.log('\n--- 3. Capturing Topic Detail (Watch Tab) ---');
    await cdp.send('Page.navigate', {
      url: 'http://localhost:5173/app/explore/topics/topic-forces-friction-cl8?tab=watch',
    });
    await sleep(2500);
    await cdp.captureScreenshot('topic-detail-watch.png');

    // 4. Topic Detail Page - Official Resources Tab
    console.log('\n--- 4. Capturing Topic Detail (Official Resources) ---');
    await cdp.send('Page.navigate', {
      url: 'http://localhost:5173/app/explore/topics/topic-forces-friction-cl8?tab=resources',
    });
    await sleep(2000);
    await cdp.captureScreenshot('topic-detail-resources.png');

    // 5. Topic Detail - Shapes Class 3 Watch Tab
    console.log('\n--- 5. Capturing Shapes Class 3 Watch Tab ---');
    await cdp.send('Page.navigate', {
      url: 'http://localhost:5173/app/explore/topics/topic-shapes-class3?tab=watch',
    });
    await sleep(2000);
    await cdp.captureScreenshot('topic-shapes-watch.png');

    // 6. Student Dashboard with Explore STEM Featured Banner
    console.log('\n--- 6. Capturing Dashboard with Explore STEM Banner ---');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/app/dashboard' });
    await sleep(2000);
    await cdp.captureScreenshot('dashboard-explore-card.png');

    // 7. Smart Reader with Matched Contextual Topic
    console.log('\n--- 7. Capturing Smart Reader Explain Matched Topic ---');
    await cdp.send('Page.navigate', {
      url: 'http://localhost:5173/app/reader/doc-forces-and-friction-cl8',
    });
    await sleep(3500);

    // Trigger Explain button
    await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const spans = Array.from(document.querySelectorAll('span'));
          const target = spans.find(s => s.textContent.includes('Friction'));
          if (target) {
            const range = document.createRange();
            range.selectNodeContents(target);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            window.dispatchEvent(new Event('mouseup'));
          }
        })()
      `,
    });
    await sleep(1500);

    // Click explain button if visible
    await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const expBtn = btns.find(b => b.textContent.includes('Explain'));
          if (expBtn) expBtn.click();
        })()
      `,
    });
    await sleep(2000);
    await cdp.captureScreenshot('reader-explain-matched.png');

    console.log('\n🎉 All Stage 3 screenshots captured successfully!');
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

main().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
