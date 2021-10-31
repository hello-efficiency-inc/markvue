import { app, Menu, dialog, ipcMain } from 'electron';
const fs = require('fs');

const isMac = process.platform === 'darwin';

export function createMenu(mainWindow) {
  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        {
          label: 'Save file',
          accelerator: 'CmdOrCtrl+S',
          click: async () => {
            mainWindow.webContents.send('fetch-data');
            ipcMain.handle('markdown-data', (event, args) => {
              dialog.showSaveDialog(mainWindow).then(({ filePath }) => {
                fs.writeFileSync(filePath, args, 'utf-8');
              });
            });
          },
        },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    }, {
        label: 'Edit',
        submenu: [{
          role: 'undo',
        },
        {
          role: 'redo',
        },
        {
          type: 'separator',
        },
        {
          role: 'cut',
        },
        {
          role: 'copy',
        },
        {
          role: 'paste',
        },
        {
          role: 'pasteandmatchstyle',
        },
        {
          role: 'delete',
        },
        {
          role: 'selectall',
        },
        ],
      }] : []) as Electron.MenuItemConstructorOptions[],
  ];
  const menu  = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
