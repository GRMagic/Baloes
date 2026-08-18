# Servidorzinho local que liga as duas janelas do modo quiosque (cada uma roda
# num perfil separado do Chrome, então não tem como trocar dados direto entre
# elas). Funciona como um mural de eventos numerados: cada janela publica o que
# fez (criou balão, estourou, limpou, mudou para noite...) e lê o que a outra
# publicou desde a última vez que perguntou.
#
# Também guarda o último período (dia/noite) e a fase da lua à parte, para uma
# janela aberta depois já nascer no mesmo período da outra.
#
# Se desliga sozinho se ninguém mais consultar por um tempo (assim não fica um
# processo pendurado depois que o quiosque fecha).

$port = 8935
$idleLimiteSeg = 300
$maxEventos = 60

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
} catch {
    # já tem um servidor rodando nessa porta (ex.: quiosque aberto de novo) — tudo bem, sai.
    exit
}

$estado = @{ periodo = 'dia'; faseIndex = -1 }
$eventos = New-Object System.Collections.ArrayList
$seq = 0
$ultimaAtividade = Get-Date
$encerrarQuiosque = $false

$async = $null

while ($true) {
    # O pedido pendente é reaproveitado entre as esperas: começar um
    # BeginGetContext novo a cada volta deixava o anterior pendurado, e as
    # requisições seguintes eram entregues a esses pendentes que ninguém mais
    # atendia — cada uma ficava ~2 s travada.
    if ($async -eq $null) { $async = $listener.BeginGetContext($null, $null) }

    if (-not $async.AsyncWaitHandle.WaitOne(2000)) {
        if (((Get-Date) - $ultimaAtividade).TotalSeconds -gt $idleLimiteSeg) { break }
        continue
    }

    $ultimaAtividade = Get-Date
    $context = $listener.EndGetContext($async)
    $async = $null
    $request = $context.Request
    $response = $context.Response

    $response.Headers.Add("Access-Control-Allow-Origin", "*")
    $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")

    if ($request.HttpMethod -eq "OPTIONS") {
        $response.StatusCode = 204
        $response.Close()
        continue
    }

    $rota = $request.Url.AbsolutePath
    $json = $null

    if ($rota -eq "/eventos") {
        if ($request.HttpMethod -eq "POST") {
            try {
                # UTF-8 na marra: o fetch manda "application/json" sem charset, e aí
                # o ContentEncoding cai no code page ANSI do Windows — o Ç (2 bytes em
                # UTF-8) chegava na outra tela como "Ã‡". Corpo de fetch é sempre UTF-8.
                $reader = New-Object IO.StreamReader($request.InputStream, [Text.Encoding]::UTF8)
                $corpo = $reader.ReadToEnd()
                $reader.Close()
                $evento = $corpo | ConvertFrom-Json

                $seq++
                $evento | Add-Member -NotePropertyName seq -NotePropertyValue $seq -Force
                [void]$eventos.Add($evento)
                while ($eventos.Count -gt $maxEventos) { $eventos.RemoveAt(0) }

                # o período fica guardado à parte: é o único estado que uma janela
                # aberta depois precisa herdar (o resto é efêmero)
                if ($evento.tipo -eq 'periodo' -and
                    ($evento.dados.periodo -eq 'dia' -or $evento.dados.periodo -eq 'noite')) {
                    $estado.periodo = $evento.dados.periodo
                    $estado.faseIndex = [int]$evento.dados.faseIndex
                }
            } catch {
                # corpo inválido — ignora e responde com o estado atual mesmo assim
            }
        }

        # sem "desde", o cliente só quer pegar o número de onde começar a ouvir
        # (não faz sentido reproduzir eventos que aconteceram antes dele existir)
        $desdeTexto = $request.QueryString["desde"]
        $novos = @()
        if ($desdeTexto -ne $null -and $desdeTexto -ne '') {
            $desde = 0
            if ([int]::TryParse($desdeTexto, [ref]$desde)) {
                $novos = @($eventos | Where-Object { $_.seq -gt $desde })
            }
        }

        $json = @{
            periodo   = $estado.periodo
            faseIndex = $estado.faseIndex
            seq       = $seq
            eventos   = $novos
        } | ConvertTo-Json -Depth 10 -Compress

    } elseif ($rota -eq "/sair" -and $request.HttpMethod -eq "POST") {
        $encerrarQuiosque = $true
        $json = '{"ok":true}'

    } else {
        $response.StatusCode = 404
    }

    if ($json -ne $null) {
        $bytes = [Text.Encoding]::UTF8.GetBytes($json)
        $response.ContentType = "application/json"
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    }

    $response.Close()

    if ($encerrarQuiosque) { break }
}

$listener.Stop()

# Fechar as janelas do quiosque só é possível daqui: o Chrome ignora
# window.close() em janela que não foi aberta por script. Encerramos apenas os
# processos do quiosque — os que usam o perfil temporário que o próprio .bat
# criou (--user-data-dir=...\baloes_kiosk*). O Chrome normal do usuário não tem
# esse perfil na linha de comando e não é tocado.
if ($encerrarQuiosque) {
    Start-Sleep -Milliseconds 400
    try {
        $alvos = Get-CimInstance Win32_Process -Filter "Name = 'chrome.exe'" -ErrorAction Stop |
                 Where-Object { $_.CommandLine -like '*baloes_kiosk*' }
        foreach ($p in $alvos) {
            try { Stop-Process -Id $p.ProcessId -Force -ErrorAction Stop } catch { }
        }
    } catch {
        # sem permissão para listar processos — o servidor sai assim mesmo
    }
}
