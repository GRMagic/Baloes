# Balões de Letras 🎈

Brinquedo simples para criançada apertar tecla e mexer o mouse. Roda como um app (Electron)
em modo quiosque, ocupando todos os monitores — ou direto no **Google Chrome**.

## Como abrir

Duas formas:

- **Duplo clique em `Abrir Balões.bat`** — abre o app em "modo quiosque": tela cheia, sem
  nenhuma barra, uma janela em cada monitor, com o máximo de travamento de teclas. Veja a
  seção "Modo quiosque" abaixo.
- **Duplo clique em `index.html`** — abre no Chrome (se for o navegador padrão), do jeito
  normal.

Na **primeira vez**, o `.bat` instala o Electron sozinho: precisa do [Node.js](https://nodejs.org)
instalado e de internet (são uns 100 MB, só uma vez). Depois disso, a internet só serve para
baixar a voz do Google (veja "Voz"). Para rodar pelo terminal: `npm install` e `npm start`.

## Gerar o executável

Dois cliques em **`Gerar Executável.bat`**. Ele instala o que faltar e gera, na pasta `dist`:

- **`Balões de Letras - instalador.exe`** — instala o brinquedo no computador (sem pedir
  nada), cria o atalho na área de trabalho e no menu Iniciar e já abre. É o melhor para o
  dia a dia: abre rápido. Para tirar, é como qualquer programa (Configurações → Aplicativos).
- **`Balões de Letras.exe`** — um arquivo só, que roda sem instalar (dá para levar num pen
  drive). Demora alguns segundos para abrir, porque se descompacta a cada vez.

O ícone (três balões com A, B e C; nos tamanhos pequenos, um balão só) é o `build/icon.ico`,
desenhado a partir de `build/icone-3-baloes.svg` e `build/icone-1-balao.svg`.

Os dois são independentes do Node.js e desta pasta: dá para copiar para outro computador com
Windows. As configurações e as vozes baixadas ficam no computador
(`%APPDATA%\Balões de Letras`), as mesmas do `Abrir Balões.bat`. O Windows pode avisar que o
programa é de "editor desconhecido" (ele não é assinado digitalmente): é só clicar em "Mais
informações" → "Executar assim mesmo".

## Como usar

- **Apertar uma letra ou número** faz um balão subir com aquela letra, embaixo da tecla
  correspondente (com as duas telas abertas, em posição sorteada — veja a seção delas). A voz
  fala a letra em voz alta. O **Ç** também vale. As acentuadas (á, ã, ê...) também, mas o
  balão mostra a letra sem acento — o acento só aparece quando ela completa uma palavra
  secreta escrita com ele.
- **Apertar a mesma letra de novo** estoura o balão daquela letra, com som e confete.
- **Clicar em cima de um balão** (botão esquerdo ou direito do mouse) também estoura.
- **Esc** estoura todos os balões de uma vez, limpando a tela.
- O mouse vira uma abelhinha 🐝 com rastro de brilhos, e zune enquanto se move (some e
  silencia quando o mouse sai da janela).

## Configurações (engrenagem)

Ao abrir, aparece por 5 segundos uma **engrenagem** no canto de cima, à direita da tela
principal. Depois ela some e, no canto de cima à esquerda, fica uma marca d'água lembrando
como fechar ("estoure todos os balões (Esc) e escreva SAIR"). Ela espera para sumir:

- se o mouse estiver em cima dela na hora, some 2 segundos depois de o mouse sair;
- com as configurações abertas não some, e ao fechá-las a contagem dos 5 segundos recomeça.

Depois que some, no app ela não volta mais — nem com o mouse em cima de onde ela estava. É de
propósito, para a criança não achá-la passeando com a abelha: para mexer nas configurações
depois, feche (`sair`) e abra de novo. Aberta no Chrome, ela volta junto com os botões quando
o mouse chega perto do topo. Clicando nela, abre o painel de configurações:

- **Máximo de balões** — de 5 a 38 (25 de fábrica), somando as duas telas. Passando disso, o
  balão mais antigo vai embora. O teto é 38 porque é o que dá para ter na tela: cada tecla tem
  um balão só (apertar de novo estoura), e são 26 letras + Ç + espaço + 10 números. Durante
  uma palavra secreta o limite não vale, senão uma palavra maior que ele nunca se formaria.
- **Palavras secretas** — de fábrica, só **Mamãe** e **Papai**. Edite direto no campo, tire
  com o **✕** e acrescente com **Adicionar** (ou Enter). Uma palavra pode ser o começo de
  outra ("Maria" e "Maria Helena", "Pai" e "Paizinho"): ao completar a menor, ela se forma e
  é falada, mas dá para seguir digitando até a maior — aí os balões se reorganizam nela. (Se
  a criança seguir digitando logo, a menor nem chega a ser falada.) Letras e números, e espaço
  entre palavras: "Maria Helena" vale,
  digitando o espaço também (ele faz um balão em branco, que sobe e vai embora quando a
  palavra se forma, deixando o vão entre os nomes). Escreva com acento: "Mamãe" se forma
  digitando o ã ou só o a, e quando a palavra se completa os balões passam a mostrar
  **MAMÃE** e a voz fala "Mamãe" certinho. A palavra **SAIR** não entra na lista: ela é
  sempre aceita, porque é a que fecha o brinquedo.
- **O que a voz fala em cada letra e número** — uma seção que abre com um clique, com um
  campo para cada tecla (A–Z, Ç, 0–9). Em branco, a voz fala a própria letra; escrevendo
  algo, fala o que foi escrito — por exemplo "Ê de estacionamento" no E. Ao confirmar o
  campo (Enter ou clicando fora), a voz já fala o texto novo, para ouvir como ficou. Para
  o som da letra, use **Ê** e **Ô**: o E e o O sozinhos a voz pode ler como as palavras "e"
  e "o" (por isso o padrão deles já é Ê e Ô, e o do Ç é "Cê cedilha").
- **Voz** — no app, a primeira é a do **Google** (a de fábrica); depois vêm as vozes
  instaladas no Windows, as de português primeiro. No Chrome, a primeira é a "Automática",
  que escolhe a melhor de português sozinha. Trocar de voz já fala uma frase de teste, e o
  **▶ Ouvir** repete.

Tudo vale na hora para as duas telas e fica guardado para a próxima vez. Com o painel aberto,
o teclado é do adulto (as teclas não fazem balão); **Pronto**, **Esc** ou um clique fora do
painel fecham.

## Com as duas telas abertas

As duas telas viram **uma sala só**, como se a segunda fosse a continuação da primeira:

- Os balões **sobem em tela sorteada e em posição sorteada**: com as duas abertas, a letra
  pode aparecer em qualquer canto de qualquer um dos dois monitores. Não importa qual das
  duas janelas está em foco — o teclado é o mesmo para as duas.
- O **limite de balões é compartilhado**: o máximo das configurações é o total somando as
  duas telas, não o de cada uma. Passando disso, o balão mais antigo das duas sobe e vai
  embora.
- **Esc limpa as duas telas** de uma vez.
- A **voz sai sempre de uma tela só** — a que recebeu a tecla. O barulho de estouro
  acontece nas duas (cada balão estoura onde está), mas as frases — a letra, os elogios
  ("Boa!", "Legal!") e o "Tchau!" — nunca são faladas em dobro, senão uma voz atropela a outra.
- Estourar repetindo a letra funciona mesmo que o balão esteja na outra tela.
- As **palavras secretas não dependem de tela**: dá para começar a digitar numa janela e
  terminar na outra (inclusive o `sair`). A palavra se monta sempre na tela principal — as
  letras que subiram na segunda atravessam para ela.

A segunda tela é sempre opcional: com um monitor só, o app abre só a principal e tudo
acontece nela, do mesmo jeito de sempre. Com mais de dois monitores, o app usa o principal e
mais um (a sala é de no máximo duas telas).

## Modo quiosque (o app)

O `Abrir Balões.bat` abre uma janela em cada monitor, já em tela cheia: o **monitor principal
do Windows** é a tela 1 (a do sol e da lua, onde as palavras se montam) e o outro é a
continuação dela. Não tem botão de tela cheia nem de segunda janela: elas já abrem assim.

O que fica travado no app:

- **Alt+F4** não fecha. **Ctrl+W**, **Ctrl+R**, **F5**, **F11**, **F12** e
  **Ctrl+Shift+I** não fazem nada.
- **Esc** só limpa os balões — não tem "tela cheia" para sair.
- Arrastar um arquivo para dentro da janela não abre nada.
- **O brinquedo não perde o foco**: enquanto o app está aberto, ficam travados no Windows
  inteiro o **Alt+Tab**, a **tecla Windows** (Iniciar, Win+D, Win+Tab...), **Ctrl+Esc**,
  **Ctrl+Shift+Esc**, **Alt+Esc**, **Alt+Espaço**, **Print Screen** (que no Windows 11 abre a
  Ferramenta de Captura) e as teclas de abrir programa que alguns teclados têm (calculadora,
  e-mail, navegador). Com a tecla Windows travada, Win+D vira só um "D" no balão.
- Os atalhos de acessibilidade que a criança dispara batendo no teclado — **Shift 5 vezes**
  (Teclas de Aderência), **Shift direito segurado** (Teclas de Filtragem) e **Num Lock
  segurado** (Teclas de Alternância) — ficam desligados, senão abririam uma pergunta por cima
  do brinquedo.

Tudo isso vale só enquanto o app está aberto: ao fechar, o Windows volta exatamente como
estava. A trava de teclas usa a biblioteca `koffi`, que o `.bat` instala junto com o Electron.

O que **não dá pra travar**: o **Ctrl+Alt+Del**, que é do próprio Windows — e é a saída de
emergência do adulto (veja "Sair").

## Teclas travadas no Chrome

Aberta direto no Chrome (`index.html`), a página bloqueia o máximo que dá para bloquear via
JavaScript: Ctrl+A, Backspace voltando página, Tab mudando foco, F5, etc. O que é reservado
pelo próprio Chrome/Windows continua funcionando:

- **Esc** sempre sai da tela cheia — é a saída de emergência do adulto, por isso deixamos ela
  livre de propósito.
- **Ctrl+W**, **Ctrl+F4** e **Alt+F4** fecham a aba/janela normalmente.
- **Alt+Tab**, **tecla Windows**, **F11** e **F12** também são do Windows/Chrome.

Como reforço: enquanto a página está em tela cheia, fechar a aba/janela ou recarregar faz o
Chrome mostrar uma confirmação nativa ("Sair do site?") antes de sair — a criança
dificilmente clica nisso sozinha.

## Sair

**Aperte Esc e digite `sair`.** Os balões estouram, a voz se despede e as janelas fecham —
as duas, se estiverem as duas abertas. É a saída do adulto.

O **Esc antes é obrigatório**: a palavra `sair` só começa a contar com a tela limpa, sem
nenhum balão. É o que impede a criança de fechar o brinquedo sem querer batendo no teclado.

Outras formas, se precisar:

- **App**: se o `sair` não funcionar, aperte **Ctrl+Alt+Del** e escolha **Gerenciador de
  Tarefas** (o Ctrl+Shift+Esc fica travado no app, para a criança não abri-lo). Ele abre por
  cima do quiosque. Encontre **Electron** na lista, clique nele e em **Finalizar tarefa**.
  Fechando assim, os atalhos de acessibilidade (Shift 5 vezes...) só voltam no próximo login
  do Windows.
- **Chrome** (`index.html`): **Esc** sai da tela cheia, depois **Alt+F4** ou o X fecha
  normalmente.

## Usar nos dois monitores no Chrome

Aberta direto no Chrome, clique em **"2ª janela"** (os botões aparecem junto da engrenagem,
quando o mouse chega no topo). Ela tenta abrir automaticamente no outro monitor; se o Chrome
pedir permissão para "gerenciar janelas em todas as telas", aceite para isso funcionar
sozinho. Se não conseguir sozinho, abre uma janela normal — é só arrastar para o outro
monitor e apertar F11 nela.

As duas janelas funcionam como uma sala só, igual ao app (veja "Com as duas telas abertas"
acima).

## Voz

Falar só a letra pura (sem soletração tipo "éfe", "ésse", sem pontuação extra) foi o que soou
melhor nos testes — por isso, de fábrica, cada tecla fala a própria letra. As exceções são o E
e o O, escritos "Ê" e "Ô" para não virarem as palavras "e" e "o", e o Ç, falado como "cê
cedilha": é o nome dele mesmo, e o caractere sozinho nem sempre é lido pela voz. Tudo isso se
troca na engrenagem (veja "Configurações").

- **No app**, a voz de fábrica é a **do Google**, a mesma que o Chrome usa. O Electron não
  traz essa voz, então o app busca o áudio de cada frase no serviço de fala do Google
  Tradutor. Cada frase é baixada **uma vez só** e fica guardada no computador (em
  `%APPDATA%\Balões de Letras\vozes`): na primeira vez que o app abre com internet, ele já
  baixa todas as letras, os números, os elogios e as palavras secretas, e daí em diante
  fala na hora, mesmo sem internet. Palavra nova é baixada assim que é adicionada.
  - Ao abrir, o app só baixa as frases que ainda não tem; o que já foi guardado continua lá
    de uma vez para outra.
  - Sem internet, o que ainda não foi baixado sai na **voz do Windows** (a Maria, que é
    feminina como a do Google) — o brinquedo nunca fica mudo.
  - Esse serviço do Google **não é oficial**: um dia ele pode mudar ou parar. Se acontecer, o
    que já foi baixado continua com a voz do Google e o resto sai na voz do Windows.
  - Para usar só as vozes do Windows, escolha uma delas na engrenagem.
- **No Chrome**, a voz do Google aparece direto na lista, e a "Automática" escolhe ela. Ela é
  online: sem internet, fica muda.

## Se a voz não falar

Verifique se o Windows tem uma voz em português instalada (Configurações → Hora e Idioma →
Fala) e se o volume não está mudo. Sem voz, tudo o resto (balão, som de estouro, zumbido da
abelha) continua funcionando normalmente.
