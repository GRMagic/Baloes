@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

rem abre o app Electron (main.js): modo quiosque, uma janela em cada monitor
set "ELECTRON=node_modules\electron\dist\electron.exe"

rem instala o que faltar: na primeira vez, ou quando o projeto ganhou uma
rem dependencia nova (a koffi, que trava o Alt+Tab, veio depois do Electron)
if not exist "%ELECTRON%" goto instala
if not exist "node_modules\koffi" goto instala
goto abre

:instala
echo Instalando o que falta, pode levar alguns minutos...
call npm install || goto erro
rem o Electron baixa o executavel na primeira vez que alguem o procura
node -e "require('electron')" || goto erro

:abre
start "" "%ELECTRON%" .
exit /b 0

:erro
echo.
echo Nao consegui instalar. Precisa do Node.js instalado e de internet.
pause
exit /b 1
