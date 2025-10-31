@echo off
REM Simple HTTP Server for Rumfields Website
REM This starts a local web server to avoid CORS issues

echo.
echo ========================================
echo   RUMFIELDS WEBSITE - LOCAL SERVER
echo ========================================
echo.
echo Starting local web server...
echo.
echo Your website will be available at:
echo http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

REM Start Python HTTP server
python -m http.server 8000

pause
