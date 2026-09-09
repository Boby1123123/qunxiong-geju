@echo off
cd /d "%~dp0"
if not exist "index.html" (
  echo [ERROR] index.html not found.
  pause
  exit /b 1
)
if not exist "chunks" (
  echo [WARN] chunks folder not found. Run elda chunks first.
  pause
  exit /b 1
)
start "" "index.html"
exit
