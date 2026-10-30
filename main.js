// Abre o brinquedo em modo quiosque em todos os monitores, no lugar do .bat
// com o Chrome. Todas as janelas ficam no mesmo processo e na mesma sessão, então
// conversam sozinhas (BroadcastChannel e localStorage compartilhados) — não
// precisa mais do servidorzinho local para sincronizar as telas.
//
// A página é uma sala de no máximo duas telas: o monitor principal do Windows
// vira a tela 1 e o próximo monitor, a tela 2. Com um monitor só, abre só a 1.

const { app, BrowserWindow, Menu, ipcMain, screen, shell } = require('electron');
const crypto = require('crypto');
const fs = require('fs/promises');
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
  // janela nova, nunca; só o endereço do projeto (rodapé das configurações)
  // abre, e no navegador do computador
  janela.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://github.com/GRMagic/Baloes')) shell.openExternal(url);
    return { action: 'deny' };
  });

  janela.loadFile(path.join(__dirname, 'index.html'), tela === '2' ? { query: { tela } } : {});
  return janela;
}

ipcMain.on('sair', () => {
  saindo = true;
  app.quit();
});

// ------------------------------------------------------------ voz do Google
// A voz do Google que o Chrome tem não vem no Electron. A mesma voz sai do
// serviço de fala do Google Tradutor — não oficial, pode mudar sem aviso —,
// então cada frase é baixada uma vez e guardada no disco: daí em diante toca
// na hora e sem internet. Quando não dá para baixar, a página fala pela voz
// do Windows.

const VOZ_URL = 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=pt-BR&q=';
const VOZ_TEMPO_MAX = 4000;    // mais que isso, a letra sairia atrasada demais
const VOZ_PAUSA_FALHA = 60000; // depois de uma falha, nem tenta por um tempo: sem
                               // internet, cada tecla esperaria o erro
const VOZ_INTERVALO = 250;     // entre um download e outro: na primeira vez são ~50
                               // frases de uma vez, e rajada é o que o Google barra
let vozFalhouEm = 0;
let vozProximoEm = 0;
const vozBaixando = new Map(); // frase -> download em andamento (as duas telas pedem as mesmas)

function arquivoDaFrase(texto) {
  const nome = crypto.createHash('sha1').update('pt-BR|' + texto).digest('hex');
  return path.join(app.getPath('userData'), 'vozes', nome + '.mp3');
}

async function baixaFrase(texto, arquivo) {
  // fetch do Node, não o net.fetch do Electron: o net.fetch vai pela sessão do
  // Chromium, com o cookie que o Google deixa nela, e depois de umas dezenas de
  // frases o Google passou a responder 429 (pedidos demais) a ele — enquanto o
  // mesmo pedido sem cookie, como o do curl, continuava funcionando
  const espera = vozProximoEm - Date.now();
  vozProximoEm = Math.max(Date.now(), vozProximoEm) + VOZ_INTERVALO;
  if (espera > 0) await new Promise(ok => setTimeout(ok, espera));
  const r = await fetch(VOZ_URL + encodeURIComponent(texto), { signal: AbortSignal.timeout(VOZ_TEMPO_MAX) });
  const tipo = r.headers.get('content-type') || '';
  if (!r.ok || !tipo.startsWith('audio/')) throw new Error(`resposta ${r.status} ${tipo}`);
  const audio = Buffer.from(await r.arrayBuffer());
  await fs.mkdir(path.dirname(arquivo), { recursive: true });
  // grava com outro nome e só depois renomeia: um app fechado no meio da
  // gravação não deixa um mp3 pela metade no lugar da frase
  await fs.writeFile(arquivo + '.tmp', audio);
  await fs.rename(arquivo + '.tmp', arquivo);
  return audio;
}

// o mp3 da frase, ou null quando não deu (a página então usa a voz do Windows)
async function vozGoogle(texto) {
  const arquivo = arquivoDaFrase(texto);
  try { return await fs.readFile(arquivo); } catch (err) { /* ainda não baixada */ }

  if (!vozBaixando.has(texto)) {
    if (Date.now() - vozFalhouEm < VOZ_PAUSA_FALHA) return null;
    vozBaixando.set(texto, baixaFrase(texto, arquivo)
      .catch(err => {
        console.warn('voz do Google: não deu para baixar', JSON.stringify(texto), '-', err.message);
        vozFalhouEm = Date.now();
        return null;
      })
      .finally(() => vozBaixando.delete(texto)));
  }
  return vozBaixando.get(texto);
}

ipcMain.handle('voz-google', (e, texto) =>
  typeof texto === 'string' && texto && texto.length <= 200 ? vozGoogle(texto) : null);

app.whenReady().then(() => {
  // Alt+Tab, tecla Windows e companhia (ver teclado.js). Sem a trava o
  // brinquedo funciona igual, só com esses atalhos livres.
  if (process.platform === 'win32') {
    try {
      const soltaTeclado = require('./teclado').travaTeclado();
      app.on('will-quit', soltaTeclado);
    } catch (err) {
      console.warn('teclado: sem a trava de atalhos -', err.message);
    }
  }

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
