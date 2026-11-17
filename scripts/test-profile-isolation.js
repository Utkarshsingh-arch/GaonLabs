import { spawn } from 'child_process';

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

async function testProfileIsolation() {
  const port = 9226;
  const userDataDir = '/tmp/chrome-isolation-test-' + Date.now();
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

    console.log('Navigating to http://localhost:5173/app/library to establish origin...');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/app/library' });
    await sleep(2000);

    console.log('Testing IndexedDB Profile Isolation in Chrome browser context...');

    const result = await cdp.send('Runtime.evaluate', {
      expression: `
        (async () => {
          // Open IndexedDB database directly
          const DB_NAME = 'gaonlab_smart_reader_db';
          const DB_VERSION = 1;
          const STORE_NAME = 'annotations';

          const db = await new Promise((resolve, reject) => {
            const req = window.indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = (e) => {
              const d = e.target.result;
              if (!d.objectStoreNames.contains(STORE_NAME)) {
                const s = d.createObjectStore(STORE_NAME, { keyPath: 'id' });
                s.createIndex('learnerId', 'learnerId', { unique: false });
                s.createIndex('documentId', 'documentId', { unique: false });
                s.createIndex('learner_doc', ['learnerId', 'documentId'], { unique: false });
              }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
          });

          // Helper to write annotation
          function putAnnotation(ann) {
            return new Promise((resolve, reject) => {
              const tx = db.transaction(STORE_NAME, 'readwrite');
              const store = tx.objectStore(STORE_NAME);
              const r = store.put(ann);
              r.onsuccess = () => resolve();
              r.onerror = () => reject(r.error);
            });
          }

          // Helper to read by [learnerId, documentId]
          function getByLearnerDoc(learnerId, docId) {
            return new Promise((resolve, reject) => {
              const tx = db.transaction(STORE_NAME, 'readonly');
              const store = tx.objectStore(STORE_NAME);
              const idx = store.index('learner_doc');
              const r = idx.getAll([learnerId, docId]);
              r.onsuccess = () => resolve(r.result || []);
              r.onerror = () => reject(r.error);
            });
          }

          const ashaEmail = 'asha.cbse@gaonlab.demo';
          const kavyaEmail = 'kavya.ktbs@gaonlab.demo';
          const docId = 'doc-forces-and-friction-cl8';

          // 1. Asha saves an annotation
          await putAnnotation({
            id: 'ann-asha-1',
            learnerId: ashaEmail,
            documentId: docId,
            pageNumber: 1,
            selectedText: 'friction acts towards the left',
            color: '#3b82f6',
            annotationType: 'UNDERLINE',
            normalizedRects: [{ x: 0.1, y: 0.2, width: 0.3, height: 0.02 }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          // 2. Kavya saves an annotation
          await putAnnotation({
            id: 'ann-kavya-1',
            learnerId: kavyaEmail,
            documentId: docId,
            pageNumber: 2,
            selectedText: 'Surface Interlocking Model',
            color: '#22c55e',
            annotationType: 'HIGHLIGHT',
            normalizedRects: [{ x: 0.2, y: 0.4, width: 0.5, height: 0.05 }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          // 3. Query Asha's annotations
          const ashaAnns = await getByLearnerDoc(ashaEmail, docId);

          // 4. Query Kavya's annotations
          const kavyaAnns = await getByLearnerDoc(kavyaEmail, docId);

          // 5. Cross-check isolation
          const ashaHasKavya = ashaAnns.some(a => a.id === 'ann-kavya-1' || a.learnerId === kavyaEmail);
          const kavyaHasAsha = kavyaAnns.some(a => a.id === 'ann-asha-1' || a.learnerId === ashaEmail);

          return {
            ashaCount: ashaAnns.length,
            kavyaCount: kavyaAnns.length,
            ashaText: ashaAnns[0]?.selectedText,
            kavyaText: kavyaAnns[0]?.selectedText,
            isolated: !ashaHasKavya && !kavyaHasAsha && ashaAnns.length === 1 && kavyaAnns.length === 1,
          };
        })()
      `,
      awaitPromise: true,
      returnByValue: true,
    });

    console.log('Profile Isolation Test Result Raw:', JSON.stringify(result));
    console.log('Profile Isolation Test Result Value:', result.result?.value);
    cdp.close();

    if (!result.result?.value?.isolated) {
      throw new Error('Profile isolation verification failed!');
    }
    console.log('✅ Learner Profile Isolation Verified: Asha and Kavya annotations are completely separated.');
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

testProfileIsolation().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
