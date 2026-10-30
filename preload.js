// A única coisa que a página precisa do Electron: pedir para fechar o
// quiosque inteiro (todas as telas) quando a palavra "sair" é digitada.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('quiosque', {
  sair: () => ipcRenderer.send('sair')
});
