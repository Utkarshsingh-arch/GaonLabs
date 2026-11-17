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
  const chromePort = 9226;
  const userDataDir = '/tmp/chrome-kannada-profile-' + Date.now();
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

    // Setup Kavya demo profile in sessionStorage
    const setKavyaSession = `
      sessionStorage.setItem('gaonlab_demo_session', JSON.stringify({
        name: 'Kavya Hegde',
        email: 'kavya.ktbs@gaonlab.demo',
        passwordHint: 'Demo@123',
        boardId: 'KARNATAKA_STATE_BOARD',
        boardName: 'Karnataka State Board',
        grade: 7,
        medium: 'kn',
        mediumName: 'Kannada (ಕನ್ನಡ)',
        subjects: ['Mathematics', 'Science'],
        schoolName: 'GHS Sirsi, Uttara Kannada',
        interests: 'Soil Science, Farming Tools, Arithmetic Puzzles',
      }));
    `;

    // 1. Kavya's Dashboard
    console.log('\n--- 1. Capturing Kavya Hegde Dashboard (KTBS Class 7 Kannada) ---');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/app/dashboard' });
    await sleep(1000);
    await cdp.send('Runtime.evaluate', { expression: setKavyaSession });
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/app/dashboard' });
    await sleep(2500);
    await cdp.captureScreenshot('kavya-dashboard.png');

    // 2. Explore STEM Hub for Kavya
    console.log('\n--- 2. Capturing Explore STEM Hub (Class 7 Kannada Topics) ---');
    await cdp.send('Page.navigate', {
      url: 'http://localhost:5173/app/explore?board=KARNATAKA_STATE_BOARD&grade=7&medium=kn',
    });
    await sleep(2500);
    await cdp.captureScreenshot('kavya-explore-hub.png');

    // 3. Topic Detail - Read Tab (ಉಷ್ಣ ಮತ್ತು ತಾಪಮಾನ ವರ್ಗಾವಣೆ)
    console.log('\n--- 3. Capturing Topic Detail (Read Tab - Kannada Lesson) ---');
    await cdp.send('Page.navigate', {
      url: 'http://localhost:5173/app/explore/topics/topic-ktbs-heat-cl7-kn?tab=read',
    });
    await sleep(2500);
    await cdp.captureScreenshot('kavya-heat-read.png');

    // 4. Topic Detail - Watch Tab (Kannada Video Player & Subtitles)
    console.log('\n--- 4. Capturing Topic Detail (Watch Tab - Kannada Video) ---');
    await cdp.send('Page.navigate', {
      url: 'http://localhost:5173/app/explore/topics/topic-ktbs-heat-cl7-kn?tab=watch',
    });
    await sleep(2500);

    // Seek video to ~10s to capture animated physics frame and captions
    await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const video = document.querySelector('video');
          if (video) {
            video.currentTime = 8.5;
            video.play().catch(() => {});
          }
        })()
      `,
    });
    await sleep(1500);
    await cdp.captureScreenshot('kavya-heat-watch.png');

    // 5. Topic Detail - Missing Video Notice for Integers (ಪೂರ್ಣಾಂಕಗಳು)
    console.log('\n--- 5. Capturing Video in Production Notice (No silent fallback) ---');
    await cdp.send('Page.navigate', {
      url: 'http://localhost:5173/app/explore/topics/topic-ktbs-integers-cl7-kn?tab=watch',
    });
    await sleep(2000);
    await cdp.captureScreenshot('kavya-integers-video-missing.png');

    // 6. Topic Detail - KTBS Official Resources
    console.log('\n--- 6. Capturing KTBS Official Resources Tab ---');
    await cdp.send('Page.navigate', {
      url: 'http://localhost:5173/app/explore/topics/topic-ktbs-heat-cl7-kn?tab=resources',
    });
    await sleep(2000);
    await cdp.captureScreenshot('kavya-heat-resources.png');

    // 7. Asha Rao CBSE Class 8 English Verification (Regression Check)
    console.log('\n--- 7. Capturing Asha Rao (CBSE Class 8 English) Regression Check ---');
    const setAshaSession = `
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
    await cdp.send('Runtime.evaluate', { expression: setAshaSession });
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/app/dashboard' });
    await sleep(2500);
    await cdp.captureScreenshot('asha-dashboard-regression-check.png');

    console.log('\n🎉 All Kannada Medium and CBSE validation screenshots captured successfully!');
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

main().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
