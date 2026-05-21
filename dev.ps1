# SafeTrade 개발 환경 한 번에 시작

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n[1/3] pytest 실행중..." -ForegroundColor Cyan
Set-Location "$root\apps\api"
uv run pytest -v
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n테스트 실패. 서버 실행을 중단합니다." -ForegroundColor Red
    exit 1
}

Write-Host "`n[2/3] API 서버 시작..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\apps\api'; uv run uvicorn app.main:app --reload"

Write-Host "[3/3] 웹 서버 시작..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\apps\web'; npm run dev"

Start-Sleep -Seconds 2
Start-Process "http://localhost:5173"

Write-Host "`n완료! 브라우저를 확인하세요." -ForegroundColor Green