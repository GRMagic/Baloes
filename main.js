// Abre o brinquedo em modo quiosque em todos os monitores, no lugar do .bat
// com o Chrome. Todas as janelas ficam no mesmo processo e na mesma sessão, então
// conversam sozinhas (BroadcastChannel e localStorage compartilhados) — não
// precisa mais do servidorzinho local para sincronizar as telas.
//
// A página é uma sala de no máximo duas telas: o monitor principal do Windows
// vira a tela 1 e o próximo monitor, a tela 2. Com um monitor só, abre só a 1.

const { app, BrowserWindow, Menu, ipcMain, screen } = require('electron');
const path = require('path');

// abrir de novo com o quiosque já no ar não empilha outro por cima
if (!app.requestSingleInstanceLock()) app.quit();

// enquanto for false, nenhuma janela fecha: é o que segura o Alt+F4 da criança.
// Só a palavra "sair" (ou o Windows desligando) libera.
let saindo = false;

// sem menu também somem os atalhos que vêm com ele: Ctrl+R recarregando,
// Ctrl+W fechando, Ctrl+Shift+I abrindo as ferramentas de desenvolvedor...
Menu.setApplicationMenu(null);

function abreTela(display, tela) {
  const { x, y, width, height } = display.bounds;
  const janela = new BrowserWindow({
    x, y, width, height,
    kiosk: true,
    frame: false,
    show: false,
    backgroundColor: '#7fd3ff', // o céu da página: nada de clarão branco ao abrir
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  });

  janela.on('close', e => { if (!saindo) e.preventDefault(); });
  janela.on('session-end', () => { saindo = true; });

  // arrastar um arquivo para dentro da janela navegaria para ele
  janela.webContents.on('will-navigate', e => e.preventDefault());
  janela.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  janela.loadFile(path.join(__dirname, 'index.html'), tela === '2' ? { query: { tela } } : {});
  return janela;
}

ipcMain.on('sair', () => {
  saindo = true;
  app.quit();
});

app.whenReady().then(() => {
  const principal = screen.getPrimaryDisplay();
  const outra = screen.getAllDisplays().find(d => d.id !== principal.id);

  const tela1 = abreTela(principal, '1');
  const tela2 = outra ? abreTela(outra, '2') : null;

  // mostra a 1 por último para o teclado já começar nela
  const pronta = janela => new Promise(ok => janela.once('ready-to-show', ok));
  Promise.all([tela1, tela2].filter(Boolean).map(pronta)).then(() => {
    if (tela2) tela2.show();
    tela1.show();
    tela1.focus();
  });
});
