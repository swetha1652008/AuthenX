import { createServer } from 'vite';

async function main() {
  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    console.log('[Test Runner] Loading test suite via Vite SSR Module Loader...');
    await server.ssrLoadModule('./scratch/test_e2e_complete.mjs');
    console.log('[Test Runner] Test suite finished successfully!');
  } catch (err) {
    console.error('[Test Runner] Error executing test suite:', err);
    process.exit(1);
  } finally {
    await server.close();
  }
}

main();
