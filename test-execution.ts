console.info('Execution Started.......!');
 
const { spawn } = require('child_process');
 
const args = ['--config', 'cucumber.json', ...process.argv.slice(2)];
 
console.log('Running cucumber-js with args:', args.join(' '));
 
const cucumber = spawn('npx', ['cucumber-js', ...args], { stdio: 'inherit', shell: true });
 
cucumber.on('error', (err) => {
  console.error('Failed to start subprocess:', err);
});
 
cucumber.on('exit', (code, signal) => {
  console.log(`cucumber-js exited with code ${code} and signal ${signal}`);
});
 
cucumber.on('close', (code) => {
  console.log(`cucumber-js closed with code ${code}`);
  process.exit(0);
});
