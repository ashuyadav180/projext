// Debug script — import each module and catch errors
const steps = [
  ['dotenv', () => import('dotenv/config')],
  ['express', () => import('express')],
  ['cors', () => import('cors')],
  ['http', () => import('http')],
  ['socket.io', () => import('socket.io')],
  ['express-rate-limit', () => import('express-rate-limit')],
  ['reelRoutes', () => import('./routes/reelRoutes.js')],
  ['uploadRoutes', () => import('./routes/upload.routes.js')],
  ['aiRoutes', () => import('./routes/ai.routes.js')],
  ['jobRoutes', () => import('./routes/job.routes.js')],
  ['dashboardRoutes', () => import('./routes/dashboard.routes.js')],
  ['userRoutes', () => import('./routes/user.routes.js')],
  ['jobStore/initJobStore', () => import('./jobs/job.store.js')],
  ['jobEngine/resumePendingJobs', () => import('./jobs/job.engine.js')],
  ['musicService', () => import('./services/music.service.js')],
  ['ioSingleton', () => import('./io-singleton.js')],
];

let ok = true;
for (const [name, fn] of steps) {
  try {
    process.stdout.write(`[LOADING] ${name} ... `);
    await fn();
    process.stdout.write(`OK\n`);
  } catch (e) {
    process.stdout.write(`FAILED\n`);
    console.error(`  ERROR in ${name}:`, e.message);
    console.error(`  Code: ${e.code || 'N/A'}`);
    ok = false;
    break;
  }
}
if (ok) console.log('\n✅ All imports OK — issue may be in express app setup or port binding');
process.exit(0);
