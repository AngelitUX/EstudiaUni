@echo off
SETLOCAL EnableDelayedExpansion

REM =============================================
REM ACTUALIZAR.bat - EstudiaUni.cl
REM Doble-click para compilar y subir cambios
REM =============================================

title EstudiaUni - Deploy
color 0A

echo.
echo =============================================
echo   EstudiaUni - Compilar y Subir Cambios
echo =============================================
echo.

cd /d "%~dp0"

REM Verificar que node este instalado
where node >nul 2>nul
if !errorlevel! neq 0 (
    color 0C
    echo ERROR: Node.js no esta instalado.
    echo Descargalo de https://nodejs.org
    goto :error_exit
)

REM Verificar que Firebase CLI este instalado
where firebase >nul 2>nul
if !errorlevel! neq 0 (
    color 0C
    echo ERROR: Firebase CLI no esta instalado.
    echo Ejecuta: npm install -g firebase-tools
    goto :error_exit
)

REM Paso 1: Compilar Angular
echo [1/3] Compilando Angular App...
echo Esto puede tomar 2-3 minutos, por favor espera...
echo.

cd frontend-app

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo Instalando dependencias de Angular...
    call npm install
    if !errorlevel! neq 0 (
        color 0C
        echo ERROR: No se pudieron instalar las dependencias.
        cd ..
        goto :error_exit
    )
)

call npm run build

if !errorlevel! neq 0 (
    color 0C
    echo.
    echo =============================================
    echo   ERROR: La compilacion de Angular fallo
    echo =============================================
    cd ..
    goto :error_exit
)

cd ..
echo.
echo [OK] Angular compilado!
echo.

REM Paso 2: Compilar Nuxt Landing
echo [2/3] Compilando Landing Page...
cd frontend-landing

if not exist "node_modules" (
    echo Instalando dependencias de Landing...
    call npm install
)

call npm run generate 2>nul

if !errorlevel! neq 0 (
    echo.
    echo AVISO: Landing fallo, pero continuamos...
    cd ..
) else (
    cd ..
    echo [OK] Landing compilada!
)

echo.

REM Paso 3: Deploy a Firebase (hosting + firestore rules)
echo [3/3] Subiendo a Firebase...
echo.
call firebase deploy --only hosting,firestore:rules
set DEPLOY_RESULT=!errorlevel!

if !DEPLOY_RESULT! neq 0 (
    color 0C
    echo.
    echo =============================================
    echo   ERROR: No se pudo subir a Firebase
    echo =============================================
    echo.
    echo Posibles causas:
    echo - No estas logueado (ejecuta: firebase login)
    echo - Problemas de red
    echo.
    goto :error_exit
)

color 0A
echo.
echo =============================================
echo   EXITO! Los cambios estan en linea
echo =============================================
echo.
echo App Angular:  https://estudiauni.web.app
echo Landing Page: https://estudiauni-landing.web.app
echo.
echo Para ver los cambios, presiona Ctrl+Shift+R
echo en tu navegador (limpia cache).
echo.
goto :finish

:error_exit
echo.
echo Revisa los errores arriba.
echo.

:finish
echo Presiona cualquier tecla para cerrar...
pause >nul
ENDLOCAL
