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

async function waitForTextLayer(cdp, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const canvas = document.querySelector('canvas');
          const spans = document.querySelectorAll('.pdf-text-layer span');
          return canvas && canvas.width > 0 && spans.length > 5;
        })()
      `,
      returnByValue: true,
    });
    if (res.result && res.result.value) {
      return true;
    }
    await sleep(400);
  }
  throw new Error('Timed out waiting for .pdf-text-layer span elements');
}

async function run() {
  const port = 9225;
  const userDataDir = '/tmp/chrome-stage2-profile-' + Date.now();
  const chromeProc = spawn('/opt/google/chrome/chrome', [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-allow-origins=*',
    '--user-data-dir=' + userDataDir,
    '--remote-debugging-port=' + port,
    '--window-size=1280,960',
    'http://localhost:5173/app/dashboard',
  ]);

  try {
    const pageTarget = await getPageTarget(port);
    const cdp = new SimpleCDP(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');
    await cdp.send('Runtime.enable');

    console.log('Setting up demo session...');
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
          schoolName: 'Govt. Model Middle School, Hosur',
          interests: 'Robotics, Plant Biology, Star Gazing'
        }));
      `,
    });

    console.log('Navigating to Reader Page...');
    await cdp.send('Page.navigate', {
      url: 'http://localhost:5173/app/reader/doc-forces-and-friction-cl8',
    });

    console.log('Waiting for PDF canvas & text layer to render completely...');
    await waitForTextLayer(cdp);
    await sleep(2000);

    // Screenshot 1: Clean PDF page
    console.log('1. Capturing Screenshot 1: Clean PDF page (docs/screenshots/clean-pdf-page.png)...');
    let ss = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(SCREENSHOT_DIR, 'clean-pdf-page.png'), Buffer.from(ss.data, 'base64'));

    // Screenshot 2: Single-word selection
    console.log('2. Selecting a single word ("friction")...');
    const selectWordRes = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const textLayer = document.querySelector('.pdf-text-layer');
          if (!textLayer) return { error: 'No text layer found' };

          const spans = Array.from(textLayer.querySelectorAll('span'));
          let targetSpan = null;
          let targetWord = 'friction';
          for (const s of spans) {
            const txt = s.textContent.toLowerCase();
            if (txt.includes('friction')) {
              targetSpan = s;
              targetWord = 'friction';
              break;
            }
          }

          if (!targetSpan) return { error: 'No target span found' };

          const text = targetSpan.textContent;
          const startIdx = text.toLowerCase().indexOf(targetWord);
          const endIdx = startIdx + targetWord.length;

          const textNode = targetSpan.firstChild || targetSpan;
          const range = document.createRange();
          range.setStart(textNode, startIdx);
          range.setEnd(textNode, endIdx);

          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);

          const rect = range.getBoundingClientRect();
          targetSpan.dispatchEvent(new MouseEvent('mouseup', {
            bubbles: true,
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2
          }));

          return { success: true, text: range.toString() };
        })()
      `,
      returnByValue: true,
    });
    console.log('Single word selection result:', selectWordRes.result.value);
    await sleep(1500);

    console.log('Capturing Screenshot 2: Single-word selection (docs/screenshots/single-word-selection.png)...');
    ss = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(SCREENSHOT_DIR, 'single-word-selection.png'), Buffer.from(ss.data, 'base64'));

    // Screenshot 3: Partial-sentence underline
    console.log('3. Selecting partial sentence ("friction acts towards the left") and clicking Underline...');
    const underlineRes = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const textLayer = document.querySelector('.pdf-text-layer');
          if (!textLayer) return { error: 'No text layer' };

          const spans = Array.from(textLayer.querySelectorAll('span'));
          let targetSpan = null;
          let targetPhrase = 'friction acts towards the left';
          for (const s of spans) {
            if (s.textContent.includes(targetPhrase)) {
              targetSpan = s;
              break;
            }
          }

          if (!targetSpan) {
            for (const s of spans) {
              if (s.textContent.includes('friction')) {
                targetSpan = s;
                targetPhrase = s.textContent.trim().slice(0, 25);
                break;
              }
            }
          }

          if (!targetSpan) return { error: 'No span found for phrase' };

          const text = targetSpan.textContent;
          const startIdx = text.indexOf(targetPhrase);
          const endIdx = startIdx + targetPhrase.length;

          const textNode = targetSpan.firstChild || targetSpan;
          const range = document.createRange();
          range.setStart(textNode, startIdx);
          range.setEnd(textNode, endIdx);

          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);

          const rect = range.getBoundingClientRect();
          targetSpan.dispatchEvent(new MouseEvent('mouseup', {
            bubbles: true,
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2
          }));

          return { success: true, text: range.toString() };
        })()
      `,
      returnByValue: true,
    });
    console.log('Partial sentence selection result:', underlineRes.result.value);
    await sleep(1000);

    // Click the Underline button in the floating toolbar
    const clickUnderlineRes = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Underline'));
          if (btn) {
            btn.click();
            return { clicked: true };
          }
          return { clicked: false, buttons: Array.from(document.querySelectorAll('button')).map(b => b.textContent) };
        })()
      `,
      returnByValue: true,
    });
    console.log('Clicked Underline button:', clickUnderlineRes.result.value);
    await sleep(1200);

    console.log('Capturing Screenshot 3: Partial-sentence underline (docs/screenshots/partial-sentence-underline.png)...');
    ss = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(SCREENSHOT_DIR, 'partial-sentence-underline.png'), Buffer.from(ss.data, 'base64'));

    // Screenshot 4: Multiline selection
    console.log('4. Selecting multiline passage across sentences...');
    const multilineRes = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const textLayer = document.querySelector('.pdf-text-layer');
          const spans = Array.from(textLayer.querySelectorAll('span')).filter(s => s.textContent.trim().length > 15);
          if (spans.length < 5) return { error: 'Not enough spans' };

          const startSpan = spans[3];
          const endSpan = spans[5];

          const range = document.createRange();
          range.setStart(startSpan.firstChild || startSpan, 5);
          range.setEnd(endSpan.firstChild || endSpan, Math.min(30, (endSpan.textContent || '').length));

          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);

          const rect = range.getBoundingClientRect();
          startSpan.dispatchEvent(new MouseEvent('mouseup', {
            bubbles: true,
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2
          }));

          return { success: true, text: range.toString() };
        })()
      `,
      returnByValue: true,
    });
    console.log('Multiline selection result:', multilineRes.result.value);
    await sleep(1000);

    // Click the Highlight button
    const clickHighlightRes = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Highlight'));
          if (btn) {
            btn.click();
            return { clicked: true };
          }
          return { clicked: false };
        })()
      `,
      returnByValue: true,
    });
    console.log('Clicked Highlight button:', clickHighlightRes.result.value);
    await sleep(1200);

    console.log('Capturing Screenshot 4: Multiline selection (docs/screenshots/multiline-selection.png)...');
    ss = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(SCREENSHOT_DIR, 'multiline-selection.png'), Buffer.from(ss.data, 'base64'));

    // Screenshot 5: Correct annotation restoration after zooming
    console.log('5. Clicking Zoom In button to verify annotation scaling & restoration...');
    await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const zoomInBtn = document.querySelector('button[title="Zoom In"]');
          if (zoomInBtn) {
            zoomInBtn.click();
            return { clicked: true };
          }
          return { clicked: false };
        })()
      `,
      returnByValue: true,
    });
    // Wait for zoom re-render
    await sleep(3000);

    console.log('Capturing Screenshot 5: Correct annotation restoration after zooming (docs/screenshots/zoomed-annotation-restoration.png)...');
    ss = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(SCREENSHOT_DIR, 'zoomed-annotation-restoration.png'), Buffer.from(ss.data, 'base64'));

    cdp.close();
    console.log('All 5 Stage 2 screenshots successfully captured in docs/screenshots/');
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

run().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
