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

set "PASTA=%~dp0"
set "PASTA=%PASTA:\=/%"
set "URL1=file:///%PASTA%index.html"

start "" "%NAVEGADOR%" --kiosk --new-window --no-first-run --no-default-browser-check --disable-pinch --overscroll-history-navigation=0 --disable-features=TranslateUI --user-data-dir="%TEMP%\baloes_kiosk" "%URL1%"
