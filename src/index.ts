import { commands, ExtensionContext, window } from 'coc.nvim';
import s from 'live-server';
export async function activate(context: ExtensionContext): Promise<void> {
  context.subscriptions.push(
    commands.registerCommand('coc-live-server.start', async () => {
      window.showInformationMessage('coc-live-server started');
      s.start({});
    }),
    commands.registerCommand('coc-live-server.stop', async () => {
      window.showInformationMessage('coc-live-server stopped');
      s.shutdown();
    })
  );
}
