const pty = require('node-pty');
const app = require('./app');

// enable WebSocket feature
require('express-ws')(app);

const PAUSE = "\x13";   // XOFF
const RESUME = "\x11";  // XON

const ARGS = [
  'ssh',
  '', // address
  '-t',
  '-p',
  '22',
  '-o',
  'PreferredAuthentications=password',
  '-o',
  'UserKnownHostsFile=/dev/null',
  '-o',
  'StrictHostKeyChecking=no'
]

function createTerminalProcess(address) {
  const args = ARGS.slice()
  args[1] = address
  const terminal = pty.spawn('/usr/bin/env', args, {
    name: 'terminal',
    cols: 80,
    rows: 30,
    cwd: process.cwd(),
    env: {}
  });

  terminal.write(PAUSE);
  return terminal;
}

// route for index.html
app.get('/',function(req, res) {
  const options = {
    root: __dirname,
    headers: {
      'Content-Type': 'text/html'
    }
  }
  res.sendFile('index.html', options);
});

// websocket route for terminal
app.ws('/terminal', (ws, req) => {
  const terminal = createTerminalProcess(req.query.address);

  terminal.write(RESUME);
  terminal.onData((data) => {
    ws.send(data);
  })

  ws.on('message', (data) => {
    terminal.write(data);
  });

  ws.on('close', () => {
    terminal.kill();
  });
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server start at http://localhost:${PORT}`)
})