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
instalado e de internet (são uns 100 MB, só uma vez). Depois disso não precisa de internet
nenhuma. Para rodar pelo terminal: `npm install` e `npm start`.

## Como usar

- **Apertar uma letra ou número** faz um balão subir com aquela letra, embaixo da tecla
  correspondente (com as duas telas abertas, em posição sorteada — veja a seção delas). A voz
  fala a letra em voz alta. O **Ç** também vale; as outras acentuadas (á, ã, ê...) não.
- **Apertar a mesma letra de novo** estoura o balão daquela letra, com som e confete.
- **Clicar em cima de um balão** (botão esquerdo ou direito do mouse) também estoura.
- **Esc** estoura todos os balões de uma vez, limpando a tela.
- O mouse vira uma abelhinha 🐝 com rastro de brilhos, e zune enquanto se move (some e
  silencia quando o mouse sai da janela).

## Configurações (engrenagem)

Ao abrir, aparece por alguns segundos uma **engrenagem** no canto de cima, à direita da tela
principal. Ela some sozinha e volta sempre que o mouse chega perto do topo da tela. Clicando
nela, abre o painel de configurações:

- **Máximo de balões** — de 5 a 50 (25 de fábrica), somando as duas telas. Passando disso, o
  balão mais antigo vai embora. Durante uma palavra secreta o limite não vale, senão uma
  palavra maior que ele nunca se formaria.
- **Palavras secretas** — edite direto no campo, tire com o **✕** e acrescente com
  **Adicionar** (ou Enter). Só letras e números. Acento não precisa ser digitado: "Mamãe"
  vale digitando M-A-M-A-E, e a voz fala "Mamãe" certinho. A palavra **SAIR** não entra na
  lista: ela é sempre aceita, porque é a que fecha o brinquedo.
- **Voz** — todas as vozes instaladas, as de português primeiro. "Automática" escolhe a
  melhor de português sozinha. Trocar de voz já fala uma frase de teste, e o **▶ Ouvir**
  repete.

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

O que **não dá pra travar**, por ser do próprio Windows: **Alt+Tab**, a **tecla Windows** e
**Ctrl+Alt+Del**.

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

- **App**: se o `sair` não funcionar, **Ctrl+Shift+Esc** abre o Gerenciador de Tarefas do
  Windows por cima do quiosque (esse atalho é do Windows, então sempre funciona). Encontre
  **Electron** na lista, clique nele e em **Finalizar tarefa**.
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
melhor nos testes — por isso o nome de várias letras no código é a própria letra. A exceção é
o Ç, que é falado como "cê cedilha": é o nome dele mesmo, e o caractere sozinho nem sempre é
lido pela voz.

- **No app**, as vozes são as do Windows (em português, normalmente **Microsoft Daniel** e
  **Microsoft Maria**). Escolha a preferida na engrenagem.
- **No Chrome**, aparece também a voz do Google, que soa mais natural — a "Automática" escolhe
  ela. Ela é online: sem internet, fica muda.

## Se a voz não falar

Verifique se o Windows tem uma voz em português instalada (Configurações → Hora e Idioma →
Fala) e se o volume não está mudo. Sem voz, tudo o resto (balão, som de estouro, zumbido da
abelha) continua funcionando normalmente.
