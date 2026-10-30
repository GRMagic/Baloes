// O que a página precisa do Electron: pedir para fechar o quiosque inteiro
// (todas as telas) quando a palavra "sair" é digitada, e o áudio da voz do
// Google (ver main.js).
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('quiosque', {
  sair: () => ipcRenderer.send('sair'),
  // mp3 da frase (Uint8Array), ou null quando não deu para baixar
  vozGoogle: texto => ipcRenderer.invoke('voz-google', texto)
});
