import { workspace } from 'coc.nvim';
export function getConfigItem(name: string, defaultValue: any = null): any {
  const config = workspace.getConfiguration();
  if (defaultValue) {
    return config.get(`coc-live-server.` + name) || defaultValue;
  } else {
    return config.get(`coc-live-server.` + name);
  }
}
