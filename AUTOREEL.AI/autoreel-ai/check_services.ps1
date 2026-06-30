
$portList = @(8015, 8012, 8003, 8006, 8014, 5000, 5173)
$nameList = @(
    'Script AI (Gemini+Claude)',
    'Voice AI (ElevenLabs)',
    'Subtitle AI (Whisper)',
    'Image AI (SDXL)',
    'Video AI (Runway+FFmpeg)',
    'Backend API (Node.js)',
    'Frontend (React+Vite)'
)

$netstatOutput = netstat -ano

$upCount   = 0
$downCount = 0

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   AutoReel.AI   Service Health Check   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

for ($i = 0; $i -lt $portList.Count; $i++) {
    $p    = $portList[$i]
    $n    = $nameList[$i]
    $hits = $netstatOutput | Select-String ":$p\s" | Select-String 'LISTENING'
    if ($hits) {
        $upCount++
        Write-Host "  [UP]   $n  (port $p)" -ForegroundColor Green
    } else {
        $downCount++
        Write-Host "  [DOWN] $n  (port $p)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "  RESULT: UP=$upCount  DOWN=$downCount" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($downCount -gt 0) {
    Write-Host "=== Detected API Issues (from script_ai.log) ===" -ForegroundColor Yellow
    Write-Host "  Gemini API:   429 - Free tier quota exceeded" -ForegroundColor Red
    Write-Host "  Claude API:   400 - Credit balance too low" -ForegroundColor Red
    Write-Host "  -> Services still run using local fallback scripts" -ForegroundColor DarkGray
    Write-Host ""
}
