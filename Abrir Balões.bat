@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

rem abre o app Electron (main.js): modo quiosque, uma janela em cada monitor
set "ELECTRON=node_modules\electron\dist\electron.exe"

if not exist "%ELECTRON%" (
  echo Primeira vez: instalando o Electron, pode levar alguns minutos...
  call npm install || goto erro
  rem o Electron baixa o executavel na primeira vez que alguem o procura
  node -e "require('electron')" || goto erro
)

start "" "%ELECTRON%" .
exit /b 0

:erro
echo.
echo Nao consegui instalar o Electron. Precisa do Node.js instalado e de internet.
pause
exit /b 1
