#!/usr/bin/env node
/**
 * Embedded PostgreSQL Lifecycle Utility
 * Enables zero-dependency local database execution for environments without Docker.
 */

const path = require('path');
const fs = require('fs');
const EmbeddedPostgres = require('embedded-postgres');

const DB_DIR = path.resolve(__dirname, '../../../infrastructure/data/embedded-pg');
const PID_FILE = path.resolve(__dirname, '../../../infrastructure/data/embedded-pg.pid');
const PORT = parseInt(process.env.POSTGRES_PORT || '54329', 10);
const USER = process.env.POSTGRES_USER || 'postgres';
const PASSWORD = process.env.POSTGRES_PASSWORD || 'postgres';
const DATABASE = process.env.POSTGRES_DB || 'gaonlab_dev';

async function startServer() {
  if (fs.existsSync(PID_FILE)) {
    console.log(`[local-postgres] PID file already exists at ${PID_FILE}. Database may already be running.`);
    process.exit(0);
  }

  fs.mkdirSync(path.dirname(DB_DIR), { recursive: true });

  const PG = EmbeddedPostgres.default || EmbeddedPostgres;
  const pg = new PG({
    databaseDir: DB_DIR,
    port: PORT,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    persistent: true,
  });

  try {
    console.log(`[local-postgres] Initializing embedded cluster at ${DB_DIR}...`);
    await pg.initialise();
  } catch (err) {
    // If already initialised, continue
  }

  console.log(`[local-postgres] Starting PostgreSQL on port ${PORT}...`);
  await pg.start();
  fs.writeFileSync(PID_FILE, String(process.pid));

  console.log(`[local-postgres] PostgreSQL is ready to accept connections!`);
  console.log(`[local-postgres] Connection URL: postgresql://${USER}:${PASSWORD}@localhost:${PORT}/${DATABASE}?schema=public`);

  // Keep process alive if called directly
  process.on('SIGINT', async () => {
    console.log('\n[local-postgres] Received SIGINT, stopping server...');
    await pg.stop();
    if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n[local-postgres] Received SIGTERM, stopping server...');
    await pg.stop();
    if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);
    process.exit(0);
  });
}

const command = process.argv[2] || 'start';

if (command === 'start') {
  startServer().catch((err) => {
    console.error('[local-postgres] Error starting database:', err);
    process.exit(1);
  });
} else if (command === 'stop') {
  if (fs.existsSync(PID_FILE)) {
    try {
      const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8'), 10);
      process.kill(pid, 'SIGTERM');
      fs.unlinkSync(PID_FILE);
      console.log(`[local-postgres] Sent SIGTERM to PID ${pid}`);
    } catch (e) {
      console.log('[local-postgres] Process already stopped or PID invalid.');
      if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);
    }
  } else {
    console.log('[local-postgres] No PID file found.');
  }
}
