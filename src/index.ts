import { commands, ExtensionContext } from 'coc.nvim';
import { getConfigItem } from './config';
import {
  liveServerProcess,
  statusItem,
  startLiveServer,
  stopLiveServer,
  toggleLiveServer,
} from './server';

process.on('exit', () => {
  if (liveServerProcess) {
    liveServerProcess.kill();
  }
  if (statusItem) {
    statusItem.dispose();
  }
});

export async function activate(context: ExtensionContext): Promise<void> {
  const enabled = getConfigItem('enabled');
  if (!enabled) {
    return;
  }
  context.subscriptions.push(
    commands.registerCommand('live-server.start', () => {
      startLiveServer();
    }),
    commands.registerCommand('live-server.stop', () => {
      stopLiveServer();
    }),
    commands.registerCommand('live-server.toggle', () => {
      toggleLiveServer();
    })
  );
}
