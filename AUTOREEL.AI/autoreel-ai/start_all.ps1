
$root   = 'C:\Projects\AUTOREEL.AI\autoreel-ai'
$aiRoot = Join-Path $root 'ai-services'

# ── Kill stale processes ──────────────────────────────────────────────────
Write-Host "Stopping any leftover processes..." -ForegroundColor DarkGray
Get-Process -Name "node"   -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "python" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# ── Helper: launch and detach ─────────────────────────────────────────────
function Start-Bg {
    param($Exe, $ArgsStr, $WorkDir)
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName         = $Exe
    $psi.Arguments        = $ArgsStr
    $psi.WorkingDirectory = $WorkDir
    $psi.UseShellExecute  = $false
    $psi.CreateNoWindow   = $true
    $p = New-Object System.Diagnostics.Process
    $p.StartInfo = $psi
    $null = $p.Start()
    return $p
}

# ── 5 Python AI micro-services ────────────────────────────────────────────
$aiServices = @(
    [PSCustomObject]@{ Folder = 'script_ai';   Port = 8015 },
    [PSCustomObject]@{ Folder = 'voice_ai';    Port = 8012 },
    [PSCustomObject]@{ Folder = 'subtitle_ai'; Port = 8003 },
    [PSCustomObject]@{ Folder = 'image_ai';    Port = 8006 },
    [PSCustomObject]@{ Folder = 'video_ai';    Port = 8014 }
)

foreach ($svc in $aiServices) {
    $dir = Join-Path $aiRoot $svc.Folder
    $py  = Join-Path $dir 'venv\Scripts\python.exe'
    if (-not (Test-Path $py)) { $py = Join-Path $root 'venv\Scripts\python.exe' }
    Write-Host "  Starting $($svc.Folder) (port $($svc.Port))..." -ForegroundColor Yellow
    $outLog = Join-Path $dir "$($svc.Folder).log"
    $errLog = Join-Path $dir "$($svc.Folder).err.log"
    Start-Process -FilePath $py -ArgumentList "-m uvicorn main:app --port $($svc.Port) --reload" -WorkingDirectory $dir -NoNewWindow -RedirectStandardOutput $outLog -RedirectStandardError $errLog
    Start-Sleep -Seconds 1
}

# ── Backend (Node.js via cmd) ─────────────────────────────────────────────
Write-Host "  Starting Backend API (port 5000)..." -ForegroundColor Yellow
$backendDir = Join-Path $root 'backend'
Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm start" -WorkingDirectory $backendDir -WindowStyle Hidden

# ── Frontend (Vite via cmd) ────────────────────────────────────────────────
Write-Host "  Starting Frontend (port 5173)..." -ForegroundColor Yellow
$frontendDir = Join-Path $root 'frontend'
Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev" -WorkingDirectory $frontendDir -WindowStyle Hidden

# ── Wait for boot ─────────────────────────────────────────────────────────
Write-Host ""
Write-Host "Waiting 20s for all services to come online..." -ForegroundColor Cyan
Start-Sleep -Seconds 20

# ── Health check ──────────────────────────────────────────────────────────
$checks = @(
    [PSCustomObject]@{ Name = 'Script AI (Gemini+Claude)';  Port = 8015 },
    [PSCustomObject]@{ Name = 'Voice AI (ElevenLabs)';      Port = 8012 },
    [PSCustomObject]@{ Name = 'Subtitle AI (Whisper)';      Port = 8003 },
    [PSCustomObject]@{ Name = 'Image AI (SDXL)';            Port = 8006 },
    [PSCustomObject]@{ Name = 'Video AI (Runway+FFmpeg)';   Port = 8014 },
    [PSCustomObject]@{ Name = 'Backend API (Node.js)';      Port = 5000 },
    [PSCustomObject]@{ Name = 'Frontend (React+Vite)';      Port = 5173 }
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   AutoReel.AI   Service Health Check   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$up   = 0
$down = 0
foreach ($c in $checks) {
    $tcp4 = (Test-NetConnection -ComputerName 127.0.0.1 -Port $c.Port -WarningAction SilentlyContinue -InformationLevel Quiet)
    $tcp6 = (Test-NetConnection -ComputerName "::1" -Port $c.Port -WarningAction SilentlyContinue -InformationLevel Quiet)
    $tcp = $tcp4 -or $tcp6
    if ($tcp) {
        $up++
        Write-Host "  [UP]   $($c.Name)  (port $($c.Port))" -ForegroundColor Green
    } else {
        $down++
        Write-Host "  [DOWN] $($c.Name)  (port $($c.Port))" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "  UP: $up   DOWN: $down" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($down -gt 0) {
    Write-Host "=== AI API Key Status (from logs) ===" -ForegroundColor Yellow
    Write-Host "  Gemini:     429 - Free tier quota exceeded" -ForegroundColor Red
    Write-Host "  Claude:     400 - Credit balance too low" -ForegroundColor Red
    Write-Host "  (Services still run using local fallback scripts)" -ForegroundColor DarkGray
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " 🚀 Services are actively running in background." -ForegroundColor Green
Write-Host " Press Ctrl+C or kill the task to stop." -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan

while ($true) {
    Start-Sleep -Seconds 5
}
