

async function connect() {
  const terminal = new Terminal({
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontWeight: 400,
    fontSize: 14,
    rows: 40,
    theme: {
      background: 'rgb(50,50,50)',
      cursor: 'rgb(255,255,0)'
    }
  });

  // use "address" query string to tell server the connection address of SSH
  const ws = new WebSocket(`ws://${location.host}/terminal?address=yuskawu%40192.168.0.165`);
  const attachAddon = new AttachAddon.AttachAddon(ws);
  const fitAddon = new FitAddon.FitAddon();

  terminal.loadAddon(attachAddon);
  terminal.loadAddon(fitAddon);

  terminal.open(document.getElementById('terminal-container'));
  terminal.focus();
  fitAddon.fit();
}


connect()

