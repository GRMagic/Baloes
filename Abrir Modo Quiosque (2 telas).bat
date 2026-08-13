@echo off
chcp 65001 >nul
setlocal

set "CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe"
set "CHROME2=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

set "NAVEGADOR="
if exist "%CHROME%" set "NAVEGADOR=%CHROME%"
if not defined NAVEGADOR if exist "%CHROME2%" set "NAVEGADOR=%CHROME2%"

if not defined NAVEGADOR (
  echo Nao encontrei o Chrome instalado nos locais padrao.
  echo Abra o index.html manualmente e aperte F11 para tela cheia.
  pause
  exit /b 1
)

rem monta uma URL file:// de verdade (barra normal), senao o navegador trata
rem "index.html?tela=2" como nome de arquivo literal e nao acha
set "PASTA=%~dp0"
set "PASTA=%PASTA:\=/%"
set "URL1=file:///%PASTA%index.html"
set "URL2=file:///%PASTA%index.html?tela=2"

rem posicoes calculadas para os seus dois monitores (1920x1080 lado a lado)
start "" "%NAVEGADOR%" --kiosk --new-window --window-position=0,0 --no-first-run --no-default-browser-check --disable-pinch --overscroll-history-navigation=0 --disable-features=TranslateUI --user-data-dir="%TEMP%\baloes_kiosk_1" "%URL1%"

ping -n 3 127.0.0.1 >nul

start "" "%NAVEGADOR%" --kiosk --new-window --window-position=1920,0 --no-first-run --no-default-browser-check --disable-pinch --overscroll-history-navigation=0 --disable-features=TranslateUI --user-data-dir="%TEMP%\baloes_kiosk_2" "%URL2%"
