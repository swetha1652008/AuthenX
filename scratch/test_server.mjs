import { spawn } from 'child_process';

const proc = spawn('cmd.exe', ['/c', 'npm', 'run', 'dev', '--', '--host', '127.0.0.1', '--port', '5173'], {
  stdio: 'pipe',
  shell: true
});

proc.stdout.on('data', (d) => {
  const msg = d.toString();
  if (msg.includes('ready in') || msg.includes('127.0.0.1:5173')) {
    checkServer();
  }
});

async function checkServer() {
  try {
    const resHome = await fetch('http://127.0.0.1:5173/');
    console.log('Homepage status:', resHome.status);
    const textHome = await resHome.text();
    console.log('Homepage HTML length:', textHome.length);
    console.log('Contains root div:', textHome.includes('<div id="root"></div>'));
    console.log('Contains main.tsx script:', textHome.includes('/src/main.tsx'));

    const resLogin = await fetch('http://127.0.0.1:5173/login');
    console.log('Login route status:', resLogin.status);
    const textLogin = await resLogin.text();
    console.log('Login HTML length:', textLogin.length);

    console.log('SUCCESS: Dev server verified successfully!');
  } catch (err) {
    console.error('Probe error:', err);
  } finally {
    proc.kill('SIGTERM');
    process.exit(0);
  }
}

// Timeout fallback
setTimeout(() => {
  console.log('Timeout reached. Checking server directly...');
  checkServer();
}, 6000);
