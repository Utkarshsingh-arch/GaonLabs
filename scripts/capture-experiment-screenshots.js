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
  const chromePort = 9227;
  const userDataDir = '/tmp/chrome-experiment-profile-' + Date.now();
  console.log(`Starting headless Chrome on port ${chromePort}...`);

  const chromeProc = spawn('/opt/google/chrome/chrome', [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-allow-origins=*',
    `--user-data-dir=${userDataDir}`,
    `--remote-debugging-port=${chromePort}`,
    '--window-size=1280,900',
    'http://localhost:5173/app/dashboard',
  ]);

  try {
    const page = await getPageTarget(chromePort);
    const cdp = new SimpleCDP(page.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');
    await cdp.send('Runtime.enable');

    console.log('Connected to Chrome DevTools Protocol');

    const setSession = `
      sessionStorage.setItem('gaonlab_demo_session', JSON.stringify({
        name: 'Asha Rao',
        email: 'asha.cbse@gaonlab.demo',
        passwordHint: 'Demo@123',
        boardId: 'CBSE',
        boardName: 'Central Board of Secondary Education',
        grade: 8,
        medium: 'en',
        mediumName: 'English',
        subjects: ['Mathematics', 'Science'],
        schoolName: 'Govt. Model Middle School, Hosur',
        interests: 'Robotics, Plant Biology, Star Gazing',
      }));
    `;

    // 1. Dashboard with Experiment Studio Card
    console.log('\n--- 1. Capturing Dashboard with 3 Feature Cards ---');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/app/dashboard' });
    await sleep(800);
    await cdp.send('Runtime.evaluate', { expression: setSession });
    await cdp.send('Page.reload');
    await sleep(1500);
    await cdp.captureScreenshot('dashboard-experiment-card.png');

    // 2. Experiment Studio Catalogue Page
    console.log('\n--- 2. Capturing Experiment Catalogue ---');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/app/experiments' });
    await sleep(1500);
    await cdp.captureScreenshot('experiment-catalogue.png');

    // 3. Chemistry Lab Bench with Dropper and Reactions
    console.log('\n--- 3. Capturing Chemistry Lab Bench ---');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/app/experiments/EXP_CHEM_01/lab' });
    await sleep(1800);

    // Switch to EXPERIMENT tab and click add drops
    await cdp.send('Runtime.evaluate', {
      expression: `
        // Click Bench tab
        const buttons = Array.from(document.querySelectorAll('button'));
        const benchBtn = buttons.find(b => b.textContent.includes('Lab Bench') || b.textContent.includes('Bench'));
        if (benchBtn) benchBtn.click();
      `,
    });
    await sleep(600);

    // Add indicator drop
    await cdp.send('Runtime.evaluate', {
      expression: `
        const addDropBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Add Indicator Drop'));
        if (addDropBtn) {
          addDropBtn.click();
          setTimeout(() => addDropBtn.click(), 500);
        }
      `,
    });
    await sleep(1000);
    await cdp.captureScreenshot('experiment-chemistry-lab.png');

    // 4. Physics Mechanics Track with Vectors and Live Graph
    console.log('\n--- 4. Capturing Physics Mechanics Track ---');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/app/experiments/EXP_PHYS_01/lab' });
    await sleep(1800);

    // Switch to EXPERIMENT tab
    await cdp.send('Runtime.evaluate', {
      expression: `
        const buttons = Array.from(document.querySelectorAll('button'));
        const benchBtn = buttons.find(b => b.textContent.includes('Lab Bench') || b.textContent.includes('Bench'));
        if (benchBtn) benchBtn.click();
      `,
    });
    await sleep(600);

    // Click launch block
    await cdp.send('Runtime.evaluate', {
      expression: `
        const launchBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Launch Block'));
        if (launchBtn) launchBtn.click();
      `,
    });
    await sleep(1200);
    await cdp.captureScreenshot('experiment-physics-lab.png');

    // 5. 7-Phase Learning Lifecycle (Prediction, Questions, Rural Application)
    console.log('\n--- 5. Capturing Learning Lifecycle Stepper & Application ---');
    await cdp.send('Runtime.evaluate', {
      expression: `
        const buttons = Array.from(document.querySelectorAll('button'));
        const applyBtn = buttons.find(b => b.textContent.includes('Apply') || b.textContent.includes('ಅನ್ವಯಿಸಿ'));
        if (applyBtn) applyBtn.click();
      `,
    });
    await sleep(800);
    await cdp.captureScreenshot('experiment-learning-lifecycle.png');

    console.log('\n✅ All Experiment Studio visual verifications successfully captured!');
  } catch (err) {
    console.error('CDP screenshot capture failed:', err);
  } finally {
    try {
      chromeProc.kill('SIGTERM');
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch {}
  }
}

main();
