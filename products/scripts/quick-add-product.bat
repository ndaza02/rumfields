@echo off
REM Quick Product Add Script for Windows
REM Rumfields Enterprises Product Database

echo.
echo ========================================
echo   RUMFIELDS - QUICK PRODUCT ADD
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

REM Run the product manager
python "%~dp0product-manager.py"

pause
