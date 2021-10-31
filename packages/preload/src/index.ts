import {contextBridge, ipcRenderer} from 'electron';

const apiKey = 'electron';
/**
 * @see https://github.com/electron/electron/issues/21437#issuecomment-573522360
 */
const api: ElectronApi = {
  ipcRendReceiveOnce: (channel: string, func: any): void => {
    ipcRenderer.once(channel, (event, ...args) => func(...args));
  },
  ipcRendReceive: (channel: string, func: any): void => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  ipcSendData: (data: string): void => {
    ipcRenderer.invoke('markdown-data', data);
  },
};

/**
 * The "Main World" is the JavaScript context that your main renderer code runs in.
 * By default, the page you load in your renderer executes code in this world.
 *
 * @see https://www.electronjs.org/docs/api/context-bridge
 */
contextBridge.exposeInMainWorld(apiKey, api);
