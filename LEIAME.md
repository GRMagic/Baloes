# Balões de Letras 🎈

Brinquedo simples para criançada apertar tecla e mexer o mouse. Testado e pensado para
**Google Chrome**.

## Como abrir

Duas formas:

- **Duplo clique em `index.html`** — abre no Chrome (se for o navegador padrão), do jeito
  normal.
- **Um dos arquivos `.bat`** — abre em "modo quiosque": tela cheia sem nenhuma barra do
  Chrome, com o máximo de travamento de teclas que dá pra conseguir. Veja a seção "Modo
  quiosque" abaixo.

Não precisa de internet nem de instalar nada em nenhum dos dois casos.

## Como usar

- **Apertar uma letra ou número** faz um balão subir com aquela letra, do lado da tela que
  combina com o lado do teclado. A voz fala a letra em voz alta.
- **Apertar a mesma letra de novo** estoura o balão daquela letra, com som e confete.
- **Clicar em cima de um balão** (botão esquerdo ou direito do mouse) também estoura.
- O mouse vira uma abelhinha 🐝 com rastro de brilhos, e zune enquanto se move (some e
  silencia quando o mouse sai da janela).

## Teclas travadas

A página bloqueia o máximo que dá para bloquear via JavaScript: Ctrl+A, Backspace voltando
página, Tab mudando foco, F5, etc. Isso vale tanto no modo normal quanto no quiosque.

O que **não dá pra bloquear de jeito nenhum** — reservado pelo próprio Chrome/Windows, e o
comportamento muda dependendo do modo:

- **Esc** — no modo normal (duplo clique + F11), sempre sai da tela cheia — é a saída de
  emergência do adulto, por isso deixamos ela livre de propósito. **No modo quiosque (`.bat`),
  Esc não faz nada** — isso é esperado: o quiosque não usa o mesmo mecanismo de "tela cheia"
  da página, então não existe estado nenhum para o Esc sair.
- **Ctrl+W** e **Ctrl+F4** (fechar aba) — reservados pelo Chrome, nenhuma página consegue
  bloquear nem liberar isso. **No modo quiosque o Chrome mesmo ignora esses atalhos** — não é
  bug, é o próprio modo quiosque protegendo contra fechamento acidental.
- **Alt+F4** — normalmente é o Windows quem fecha a janela, independente do que a página faz.
  **Testado e confirmado: no modo quiosque do Chrome, Alt+F4 também não fecha** — provavelmente
  porque a janela do quiosque não tem a moldura padrão do Windows, então não há para onde
  mandar o "fechar". No modo normal (sem `.bat`), Alt+F4 funciona normalmente.
- **Alt+Tab** e a **tecla Windows** — são do próprio Windows, o navegador nem chega a ver.
- **F11**, **F12** — reservados pelo navegador (no quiosque, F11 não faz nada por não ter
  janela "normal" para voltar).

No modo normal (não quiosque), como reforço extra: enquanto a página está em tela cheia,
fechar a aba/janela ou recarregar faz o Chrome mostrar uma confirmação nativa ("Sair do
site?") antes de sair — a criança dificilmente clica nisso sozinha. Esse reforço **não se
aplica ao modo quiosque** (ele já bloqueia Ctrl+W/Ctrl+F4 por conta própria, então a
confirmação nem chega a ser necessária).

## Modo quiosque (bloqueio máximo)

- **`Abrir Modo Quiosque (1 tela).bat`** — abre em tela cheia sem barra de endereço, sem
  abas.
- **`Abrir Modo Quiosque (2 telas).bat`** — abre uma janela em cada monitor, já posicionadas
  certas para os seus dois monitores lado a lado.

Usam um perfil de navegador separado e temporário, então não mexem nos seus favoritos,
senhas ou abas normais do Chrome.

## Sair

- **Modo normal** (duplo clique no `index.html`): **Esc** sai da tela cheia, depois
  **Alt+F4** ou o X fecha normalmente.
- **Modo quiosque** (`.bat`): nem Esc nem Alt+F4 fazem nada — testado e confirmado. A forma
  garantida de sair é **Ctrl+Shift+Esc**, que abre o Gerenciador de Tarefas do Windows por
  cima do quiosque (esse atalho é do Windows, não do navegador, então sempre funciona).
  Encontre **Google Chrome** na lista, clique nele e em **Finalizar tarefa**.

## Usar nos dois monitores sem o `.bat`

No modo normal (duplo clique no `index.html`), clique em **"2ª janela"**. Ela tenta abrir
automaticamente no outro monitor; se o Chrome pedir permissão para "gerenciar janelas em
todas as telas", aceite para isso funcionar sozinho. Se não conseguir sozinho, abre uma
janela normal — é só arrastar para o outro monitor e apertar F11 nela.

**Importante:** as duas janelas são independentes. Cada uma só reage ao teclado quando está
em foco (a última clicada). Isso é de propósito, para não precisar de servidor nem de
internet — cada tela é uma "sala" própria de balões.

## Voz

A página usa a voz do Google no Chrome, que soa bem mais natural que a voz padrão do
Windows. Falar só a letra pura (sem soletração tipo "éfe", "ésse", sem pontuação extra) foi
o que soou melhor nos testes — por isso o nome de várias letras no código é a própria letra.

## Se a voz não falar

Verifique se o Windows tem uma voz em português instalada (Configurações → Hora e Idioma →
Fala) e se o volume do Chrome não está mudo. Sem voz, tudo o resto (balão, som de estouro,
zumbido da abelha) continua funcionando normalmente.
