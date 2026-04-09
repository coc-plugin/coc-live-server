import { workspace, window, StatusBarItem } from 'coc.nvim';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { getConfigItem } from './config';

export let liveServerProcess: ChildProcessWithoutNullStreams | null = null;
export let statusItem: StatusBarItem | null = null;

export function startLiveServer() {
  const serverModule = require.resolve('live-server/live-server');
  const port = getConfigItem('port', 8080);
  const host = getConfigItem('host', '0.0.0.0');
  const cors = getConfigItem('cors');
  const wait = getConfigItem('wait', 100);
  const spa = getConfigItem('spa');
  const open = getConfigItem('open', true);
  const log = getConfigItem('log', true);
  const proxy = getConfigItem('proxy', '');
  const STATUS = `liveServer[:${port}]`;
  const args: string[] = [];
  if (liveServerProcess) {
    stopLiveServer(false);
  }

  statusItem = window.createStatusBarItem(0);
  statusItem.text = 'LiveServer: starting';
  statusItem.show();

  if (port && typeof port === 'number') {
    args.push(' --port=' + port);
  }

  if (host && typeof host === 'string') {
    args.push(' --host=' + host);
  }

  if (cors) {
    args.push(' --cors');
  }

  if (spa) {
    args.push(' --spa');
  }

  if (!log) {
    args.push(' --quiet');
  }

  if (!open) {
    args.push(' --no-browser');
  }

  if (wait && typeof wait === 'number') {
    args.push(' --wait=' + wait);
  }

  if (proxy && typeof proxy === 'string' && proxy.trim() !== '') {
    args.push(' --proxy=' + proxy);
  }

  args.push(` ${workspace.root}`);

  liveServerProcess = spawn('node', [serverModule, ...args], { shell: true });

  if (liveServerProcess) {
    liveServerProcess.stdout.on('data', (data) => {
      if (statusItem && statusItem?.text !== STATUS) {
        statusItem.text = STATUS;
      }
      const output = data.toString();
      const ansiRegex = /\x1b\[[0-9;]*m/g;
      window.showInformationMessage(`coc-live-server: ${output.replace(ansiRegex, '')}`);
    });
    liveServerProcess.stderr.on('data', () => {
      if (statusItem) {
        statusItem.text = 'LiveServer: error';
      }
      window.showErrorMessage(
        'Failed to start coc-live-server. Please ensure live-server is installed.'
      );
    });

    liveServerProcess.on('close', () => {
      stopLiveServer();
    });
  }
}

export function stopLiveServer(showMsg = true) {
  if (liveServerProcess) {
    liveServerProcess.kill();
    liveServerProcess = null;
  } else {
    liveServerProcess = null;
  }
  if (statusItem) {
    statusItem.text = '';
    statusItem.hide();
    statusItem.dispose();
  }
  if (showMsg) {
    window.showInformationMessage('coc-live-server stopped');
  }
}

export function toggleLiveServer() {
  if (liveServerProcess) {
    stopLiveServer();
  } else {
    startLiveServer();
  }
}
