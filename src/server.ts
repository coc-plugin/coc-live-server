import { workspace, window, StatusBarItem } from 'coc.nvim';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { getConfigItem } from './config';

export let liveServerProcess: ChildProcessWithoutNullStreams | null = null;
export let statusItem: StatusBarItem | null = null;

export function startLiveServer() {
  const serverModule = require.resolve('live-server/live-server');
  const port = getConfigItem('port', 8080);
  const args: string[] = [];
  if (liveServerProcess) {
    stopLiveServer(false);
  }

  statusItem = window.createStatusBarItem(0);
  statusItem.text = 'Live Server: starting';
  statusItem.show();

  if (port && typeof port === 'number') {
    args.push(' --port=' + port);
  }

  args.push(` ${workspace.root}`);

  liveServerProcess = spawn('node', [serverModule, ...args], { shell: true });

  if (liveServerProcess) {
    liveServerProcess.stdout.on('data', (data) => {
      if (statusItem && statusItem?.text !== 'Port: ' + port) {
        statusItem.text = 'Live Server Port: ' + port;
      }
      const output = data.toString();
      const ansiRegex = /\x1b\[[0-9;]*m/g;
      window.showInformationMessage(`coc-live-server: ${output.replace(ansiRegex, '')}`);
    });
    liveServerProcess.stderr.on('data', () => {
      if (statusItem) {
        statusItem.text = 'Live Server: error';
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
