// Trava, enquanto o quiosque está aberto, os atalhos do Windows que tirariam o
// foco do brinquedo: Alt+Tab, a tecla Windows (Iniciar, Win+D, Win+Tab...),
// Ctrl+Esc, Ctrl+Shift+Esc, Alt+Esc, Alt+Espaço, Print Screen (no Windows 11
// abre a Ferramenta de Captura) e as teclas que abrem programa (calculadora,
// e-mail, navegador). Página nenhuma consegue isso: é um gancho de teclado do
// próprio Windows (WH_KEYBOARD_LL), que vê a tecla antes do sistema e pode
// engoli-la. O Ctrl+Alt+Del não dá para travar — e é a saída de emergência do
// adulto (de lá, o Gerenciador de Tarefas).
//
// Também desliga, só nesta sessão do Windows, os atalhos de acessibilidade que
// a criança dispara batendo no teclado — Shift 5 vezes (Teclas de Aderência),
// Shift direito segurado (Teclas de Filtragem) e Num Lock segurado (Teclas de
// Alternância) —, que abrem uma pergunta por cima do brinquedo. É a receita da
// Microsoft para jogos em tela cheia; o estado de antes volta ao fechar, e nada
// é gravado no perfil (se o app cair, volta sozinho no próximo login).

const koffi = require('koffi');

const user32 = koffi.load('user32.dll');
const kernel32 = koffi.load('kernel32.dll');

const KBDLLHOOKSTRUCT = koffi.struct('KBDLLHOOKSTRUCT', {
  vkCode: 'uint32', scanCode: 'uint32', flags: 'uint32', time: 'uint32', dwExtraInfo: 'uintptr'
});
const LowLevelKeyboardProc = koffi.proto('intptr __stdcall LowLevelKeyboardProc(int nCode, uintptr wParam, void *lParam)');

const SetWindowsHookExW   = user32.func('intptr __stdcall SetWindowsHookExW(int idHook, LowLevelKeyboardProc *lpfn, void *hmod, uint32 dwThreadId)');
const CallNextHookEx      = user32.func('intptr __stdcall CallNextHookEx(intptr hhk, int nCode, uintptr wParam, void *lParam)');
const UnhookWindowsHookEx = user32.func('bool __stdcall UnhookWindowsHookEx(intptr hhk)');
const GetAsyncKeyState    = user32.func('int16 __stdcall GetAsyncKeyState(int vKey)');
const SystemParametersInfoW = user32.func('bool __stdcall SystemParametersInfoW(uint32 uiAction, uint32 uiParam, _Inout_ void *pvParam, uint32 fWinIni)');
const GetModuleHandleW    = kernel32.func('void * __stdcall GetModuleHandleW(void *lpModuleName)');

const WH_KEYBOARD_LL = 13;
const LLKHF_ALTDOWN = 0x20;

const VK = { TAB: 0x09, ESC: 0x1B, ESPACO: 0x20, PRINT: 0x2C, LWIN: 0x5B, RWIN: 0x5C, CTRL: 0x11 };
// 0xA6-0xAC: teclas de navegador; 0xB4-0xB7: e-mail, mídia, "meu computador", calculadora
const ABRE_PROGRAMA = new Set([0xA6, 0xA7, 0xA8, 0xA9, 0xAA, 0xAB, 0xAC, 0xB4, 0xB5, 0xB6, 0xB7]);

function engole(vk, flags) {
  const alt = (flags & LLKHF_ALTDOWN) !== 0;
  const ctrl = (GetAsyncKeyState(VK.CTRL) & 0x8000) !== 0;
  if (vk === VK.LWIN || vk === VK.RWIN || vk === VK.PRINT || ABRE_PROGRAMA.has(vk)) return true;
  if (vk === VK.TAB || vk === VK.ESPACO) return alt;
  if (vk === VK.ESC) return alt || ctrl; // o Esc sozinho é do brinquedo: limpa os balões
  return false;
}

// cada atalho de acessibilidade: [ação de ler, ação de gravar, tamanho da estrutura]
const ATALHOS = [
  [0x003A, 0x003B, 8],  // Teclas de Aderência (STICKYKEYS)
  [0x0032, 0x0033, 24], // Teclas de Filtragem (FILTERKEYS)
  [0x0034, 0x0035, 8]   // Teclas de Alternância (TOGGLEKEYS)
];
const LIGADO = 0x1, ATALHO_ATIVO = 0x4, PERGUNTA_NO_ATALHO = 0x8;

function desligaAtalhosDeAcessibilidade() {
  const antes = [];
  for (const [ler, gravar, tamanho] of ATALHOS) {
    const atual = Buffer.alloc(tamanho);
    atual.writeUInt32LE(tamanho, 0);
    if (!SystemParametersInfoW(ler, tamanho, atual, 0)) continue;
    antes.push([gravar, tamanho, Buffer.from(atual)]);
    const flags = atual.readUInt32LE(4);
    if (flags & LIGADO) continue; // quem usa o recurso de verdade continua com ele
    atual.writeUInt32LE(flags & ~(ATALHO_ATIVO | PERGUNTA_NO_ATALHO), 4);
    SystemParametersInfoW(gravar, tamanho, atual, 0);
  }
  return () => {
    for (const [gravar, tamanho, original] of antes) SystemParametersInfoW(gravar, tamanho, original, 0);
  };
}

// liga as travas e devolve a função que as solta
function travaTeclado() {
  const proc = koffi.register((nCode, wParam, lParam) => {
    try {
      if (nCode >= 0) {
        const tecla = koffi.decode(lParam, KBDLLHOOKSTRUCT);
        if (engole(tecla.vkCode, tecla.flags)) return 1;
      }
    } catch (err) { /* na dúvida, a tecla passa */ }
    return CallNextHookEx(0, nCode, wParam, lParam);
  }, koffi.pointer(LowLevelKeyboardProc));

  const gancho = SetWindowsHookExW(WH_KEYBOARD_LL, proc, GetModuleHandleW(null), 0);
  if (!gancho) console.warn('teclado: o Windows não aceitou o gancho; os atalhos dele ficam livres');
  const devolveAcessibilidade = desligaAtalhosDeAcessibilidade();

  return () => {
    if (gancho) UnhookWindowsHookEx(gancho);
    koffi.unregister(proc);
    devolveAcessibilidade();
  };
}

module.exports = { travaTeclado };
