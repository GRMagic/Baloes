@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

rem Gera os executaveis do app na pasta dist (electron-builder; a configuracao
rem fica em "build", no package.json):
rem   "Balões de Letras - instalador.exe": instala, cria atalho e abre rapido
rem   "Balões de Letras.exe": um arquivo so, roda sem instalar, mas demora uns
rem   segundos para abrir (ele se descompacta a cada vez)

echo Instalando o que falta...
call npm install || goto erro

echo.
echo Gerando os executaveis, pode levar alguns minutos...
call npm run empacotar || goto erro

echo.
echo Pronto! Os executaveis estao na pasta dist.
start "" explorer "%~dp0dist"
pause
exit /b 0

:erro
echo.
echo Nao consegui gerar o executavel. Veja as mensagens acima.
echo Precisa do Node.js instalado e de internet na primeira vez.
pause
exit /b 1
