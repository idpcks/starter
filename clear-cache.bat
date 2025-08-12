@echo off
echo Clearing Next.js cache...
echo.

echo Stopping development server (if running)...
taskkill /f /im node.exe >nul 2>&1

echo Removing .next folder...
if exist ".next" (
    rmdir /s /q ".next"
    echo .next folder removed.
) else (
    echo .next folder not found.
)

echo.
echo Cache cleared successfully!
echo.
echo To restart your development server, run:
echo npm run dev
echo.
pause
