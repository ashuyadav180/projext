
$root = 'C:\Projects\AUTOREEL.AI\autoreel-ai'

Write-Host "=== Checking Python environments ===" -ForegroundColor Cyan

$paths = @(
    'venv\Scripts\python.exe',
    'ai-services\script_ai\venv\Scripts\python.exe',
    'ai-services\voice_ai\venv\Scripts\python.exe',
    'ai-services\subtitle_ai\venv\Scripts\python.exe',
    'ai-services\image_ai\venv\Scripts\python.exe',
    'ai-services\video_ai\venv\Scripts\python.exe'
)

foreach ($rel in $paths) {
    $full = Join-Path $root $rel
    $exists = Test-Path $full
    if ($exists) {
        Write-Host "  [FOUND] $rel" -ForegroundColor Green
    } else {
        Write-Host "  [MISS]  $rel" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Checking which services bat file uses ===" -ForegroundColor Cyan
Write-Host "  start_services.bat uses: venv\Scripts\python.exe (per-service)" -ForegroundColor White

Write-Host ""
Write-Host "=== Starting Script AI manually to test ===" -ForegroundColor Cyan
$scriptAiDir = Join-Path $root 'ai-services\script_ai'
$py = Join-Path $scriptAiDir 'venv\Scripts\python.exe'
if (-not (Test-Path $py)) {
    $py = Join-Path $root 'venv\Scripts\python.exe'
    Write-Host "  Using root venv: $py" -ForegroundColor Yellow
} else {
    Write-Host "  Using service venv: $py" -ForegroundColor Yellow
}

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = $py
$psi.Arguments = "-m uvicorn main:app --port 8005 --reload"
$psi.WorkingDirectory = $scriptAiDir
$psi.UseShellExecute = $false
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError  = $true
$psi.CreateNoWindow = $true

$proc = New-Object System.Diagnostics.Process
$proc.StartInfo = $psi
$proc.Start() | Out-Null

Start-Sleep -Seconds 7

if (-not $proc.HasExited) {
    Write-Host "  Script AI started successfully (PID $($proc.Id))" -ForegroundColor Green
    $proc.Kill()
} else {
    $err = $proc.StandardError.ReadToEnd()
    $out = $proc.StandardOutput.ReadToEnd()
    Write-Host "  Script AI FAILED to start (ExitCode $($proc.ExitCode))" -ForegroundColor Red
    Write-Host "  STDOUT: $out"
    Write-Host "  STDERR: $err"
}
