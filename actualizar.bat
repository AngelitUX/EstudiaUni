@echo off
setlocal enabledelayedexpansion

REM ===========================================================================
REM  EstudiaUni.cl - Script de actualizacion del sitio (deploy de Hosting)
REM
REM  Que hace:   compila el frontend y publica el resultado en Firebase Hosting.
REM  Que NO hace: no toca las reglas de Firestore, ni el backend NestJS, ni la
REM               base de datos. Solo publica archivos estaticos del sitio.
REM
REM  Todo el texto va SIN TILDES a proposito: la consola de Windows (cmd.exe)
REM  no muestra bien los acentos en un .bat y se veria como basura.
REM ===========================================================================

cd /d "%~dp0"

REM  Este .bat tiene que vivir en la raiz del repositorio, junto a firebase.json.
REM  Si alguien lo copia a otro sitio (al Escritorio, por ejemplo) se detiene aca
REM  en vez de fallar a medio camino con un error confuso.
if not exist "firebase.json" goto :malaubicacion
if not exist "frontend-app\package.json" goto :malaubicacion

set "PROYECTO=estudiauni"
set "TARGET=app"
set "DOMINIO=https://estudiauni.cl"
set "SALIDA=frontend-app\dist\frontend-app\browser"

echo.
echo ===========================================================
echo   ACTUALIZAR ESTUDIAUNI.CL
echo ===========================================================
echo.
echo   Proyecto Firebase : %PROYECTO%
echo   Sitio             : %DOMINIO%
echo.

REM ---------------------------------------------------------------------------
REM  Paso 0 - Elegir modo
REM ---------------------------------------------------------------------------
echo   Que quieres hacer?
echo.
echo     [1] VISTA PREVIA  - publica en una URL temporal y secreta.
echo                         NO toca el sitio real. Nadie se entera.
echo                         Ideal para revisar antes de publicar. (RECOMENDADO)
echo.
echo     [2] PRODUCCION    - actualiza %DOMINIO% de verdad.
echo                         Lo veran todos los usuarios al instante.
echo.
echo     [3] Salir sin hacer nada
echo.
set "MODO="
set /p MODO="  Escribe 1, 2 o 3 y pulsa Enter: "

REM  Se usan saltos explicitos en vez de "if / else if / else": las cadenas
REM  else-if de cmd.exe son fragiles y rompen el script entero con un
REM  "La sintaxis del comando no es correcta".
if "%MODO%"=="3" goto :cancelado
if "%MODO%"=="1" goto :modo_preview
if "%MODO%"=="2" goto :modo_produccion
echo.
echo   [X] Opcion no valida. No se hizo nada.
goto :fin

:modo_preview
set "ESPRODUCCION=0"
set "ETIQUETA=VISTA PREVIA"
goto :comprobaciones

:modo_produccion
set "ESPRODUCCION=1"
set "ETIQUETA=PRODUCCION"
goto :comprobaciones

:comprobaciones
echo.
echo -----------------------------------------------------------
echo   COMPROBACIONES PREVIAS
echo -----------------------------------------------------------
echo.

set "HAYAVISOS=0"

REM ---------------------------------------------------------------------------
REM  Paso 1 - Herramientas necesarias
REM ---------------------------------------------------------------------------
where node >nul 2>&1
if errorlevel 1 (
    echo   [X] No se encuentra Node.js. Instalalo desde https://nodejs.org
    goto :error
)
for /f "delims=" %%v in ('node --version 2^>nul') do set "NODEVER=%%v"
echo   [OK] Node.js !NODEVER!

where firebase >nul 2>&1
if errorlevel 1 (
    echo   [X] No esta instalada la herramienta de Firebase ^(firebase-tools^).
    echo.
    set "INSTALAR="
    set /p INSTALAR="       Quieres instalarla ahora? (S/N): "
    if /i "!INSTALAR!"=="S" (
        echo.
        echo       Instalando firebase-tools ^(puede tardar un par de minutos^)...
        call npm install -g firebase-tools
        if errorlevel 1 (
            echo   [X] Fallo la instalacion.
            goto :error
        )
        where firebase >nul 2>&1
        if errorlevel 1 (
            echo   [X] Se instalo pero Windows aun no la encuentra.
            echo       Cierra esta ventana, abre una nueva y vuelve a ejecutar.
            goto :error
        )
    ) else (
        echo.
        echo       Instalala tu mismo con:  npm install -g firebase-tools
        goto :error
    )
)
for /f "delims=" %%v in ('firebase --version 2^>nul') do set "FBVER=%%v"
echo   [OK] firebase-tools !FBVER!

REM ---------------------------------------------------------------------------
REM  Paso 2 - Sesion de Firebase iniciada
REM ---------------------------------------------------------------------------
call firebase login:list 2>&1 | findstr /C:"No authorized" >nul
if not errorlevel 1 (
    echo   [X] No hay ninguna cuenta de Firebase conectada.
    echo       Ejecuta:  firebase login
    goto :error
)
echo   [OK] Sesion de Firebase iniciada

REM ---------------------------------------------------------------------------
REM  Paso 3 - Estado de git (que se publique lo que crees que se publica)
REM ---------------------------------------------------------------------------
set "RAMA=?"
set "SUCIO=0"
where git >nul 2>&1
if not errorlevel 1 (
    for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set "RAMA=%%b"
    for /f "delims=" %%c in ('git log -1 --oneline 2^>nul') do set "COMMIT=%%c"
    for /f "delims=" %%s in ('git status --porcelain 2^>nul') do set "SUCIO=1"
    echo   [OK] Rama actual: !RAMA!
    echo        Ultimo commit: !COMMIT!
    if "!SUCIO!"=="1" (
        echo   [*] Tienes cambios SIN COMMITEAR.
        echo       Se publicara lo que hay en tu carpeta, commiteado o no.
        echo       Si algo sale mal, no habra un commit al que volver.
        set "HAYAVISOS=1"
    )
) else (
    echo   [*] No se encontro git. No se puede comprobar que se va a publicar.
    set "HAYAVISOS=1"
)

REM ---------------------------------------------------------------------------
REM  Paso 4 - La direccion del backend (el error mas caro de este proyecto)
REM ---------------------------------------------------------------------------
REM  Solo la ASIGNACION real de apiUrl, no el "localhost:3000" que aparece en un
REM  comentario del propio archivo (eso daba un falso aviso en cada despliegue).
findstr /C:"apiUrl = 'http://localhost" /C:"apiUrl='http://localhost" "frontend-app\src\environments\environment.ts" >nul 2>&1
if not errorlevel 1 (
    echo   [*] environment.ts apunta el backend a http://localhost:3000
    echo       En el sitio publicado NO va a funcionar nada que pase por el
    echo       backend: chat con Foco, analisis IA, pagos con Flow, cupones,
    echo       transferencias y el panel de suscripciones.
    echo       El resto del sitio ^(ruta, ensayos, perfil^) si funciona.
    set "HAYAVISOS=1"
)

REM ---------------------------------------------------------------------------
REM  Resumen y confirmacion
REM ---------------------------------------------------------------------------
echo.
echo -----------------------------------------------------------
echo   RESUMEN
echo -----------------------------------------------------------
echo.
echo     Modo    : !ETIQUETA!
echo     Rama    : !RAMA!
if "!ESPRODUCCION!"=="1" (
    echo     Destino : %DOMINIO%   ^<-- SITIO REAL, LO VEN LOS USUARIOS
) else (
    echo     Destino : URL temporal ^(el sitio real NO se toca^)
)
echo.

if "!HAYAVISOS!"=="1" (
    echo   ^>^>^> HAY AVISOS ARRIBA. Leelos antes de continuar. ^<^<^<
    echo.
)

if "!ESPRODUCCION!"=="1" (
    echo   Esto va a reemplazar el sitio que ven los usuarios reales.
    echo   Para continuar escribe exactamente:  SI
    echo   ^(cualquier otra cosa cancela^)
    echo.
    set "OK1="
    set /p OK1="  Continuar? "
    if /i not "!OK1!"=="SI" goto :cancelado
) else (
    set "OK1="
    set /p OK1="  Continuar? (S/N): "
    if /i not "!OK1!"=="S" goto :cancelado
)

REM ---------------------------------------------------------------------------
REM  Paso 5 - Dependencias
REM ---------------------------------------------------------------------------
echo.
echo -----------------------------------------------------------
echo   1/3  Revisando dependencias...
echo -----------------------------------------------------------
echo.
pushd frontend-app
call npm install --no-audit --no-fund
if errorlevel 1 (
    popd
    echo.
    echo   [X] Fallo la instalacion de dependencias. NO se publico nada.
    goto :error
)
popd

REM ---------------------------------------------------------------------------
REM  Paso 6 - Compilar (aqui se cae si el codigo tiene errores)
REM ---------------------------------------------------------------------------
echo.
echo -----------------------------------------------------------
echo   2/3  Compilando el sitio... ^(tarda 1-3 minutos^)
echo -----------------------------------------------------------
echo.
pushd frontend-app
call npm run build
if errorlevel 1 (
    popd
    echo.
    echo   ============================================================
    echo   [X] LA COMPILACION FALLO. NO SE PUBLICO NADA.
    echo       El sitio en internet sigue intacto, no se rompio nada.
    echo       Lee el error de arriba, corrigelo y vuelve a ejecutar.
    echo   ============================================================
    goto :error
)
popd

REM ---------------------------------------------------------------------------
REM  Paso 7 - Comprobar que la compilacion produjo lo que debe
REM ---------------------------------------------------------------------------
if not exist "%SALIDA%\index.html" (
    echo.
    echo   [X] No se genero %SALIDA%\index.html
    echo       Algo raro paso con la compilacion. NO se publico nada.
    goto :error
)
if not exist "%SALIDA%\index.csr.html" (
    echo.
    echo   [X] No se genero index.csr.html
    echo       Firebase lo necesita para servir las paginas privadas
    echo       ^(/dashboard, /ruta, ...^). NO se publico nada.
    goto :error
)
echo.
echo   [OK] Compilacion correcta y completa.

REM ---------------------------------------------------------------------------
REM  Paso 8 - Ultima confirmacion (solo produccion)
REM ---------------------------------------------------------------------------
if "!ESPRODUCCION!"=="1" (
    echo.
    echo -----------------------------------------------------------
    echo   ULTIMO PASO ANTES DE PUBLICAR
    echo -----------------------------------------------------------
    echo.
    echo   Compilo bien. Ahora si se reemplaza %DOMINIO%
    echo.
    echo   Escribe exactamente:  DESPLEGAR
    echo.
    set "OK2="
    set /p OK2="  Confirmar: "
    if /i not "!OK2!"=="DESPLEGAR" goto :cancelado
)

REM ---------------------------------------------------------------------------
REM  Paso 9 - Publicar
REM ---------------------------------------------------------------------------
echo.
echo -----------------------------------------------------------
echo   3/3  Publicando...
echo -----------------------------------------------------------
echo.

if "!ESPRODUCCION!"=="1" (
    call firebase deploy --only hosting:%TARGET% --project %PROYECTO%
) else (
    REM  Canal fijo "preview": siempre da la misma URL, y cada vista previa
    REM  nueva reemplaza a la anterior y reinicia los 7 dias de caducidad.
    call firebase hosting:channel:deploy preview --expires 7d --project %PROYECTO%
)

if errorlevel 1 (
    echo.
    echo   [X] Fallo la publicacion. Lee el error de arriba.
    if "!ESPRODUCCION!"=="1" (
        echo       El sitio anterior deberia seguir en pie: Firebase solo
        echo       cambia la version cuando la subida termina completa.
    )
    goto :error
)

echo.
echo ===========================================================
if "!ESPRODUCCION!"=="1" (
    echo   LISTO. El sitio esta actualizado.
    echo.
    echo   Abre %DOMINIO% y revisalo.
    echo   Usa Ctrl+F5 para saltarte la cache del navegador.
    echo.
    echo   Si algo salio mal, se puede volver a la version anterior
    echo   desde la consola de Firebase:
    echo     Hosting  ^>  Historial de versiones  ^>  Revertir
) else (
    echo   LISTO. Vista previa publicada.
    echo.
    echo   Arriba aparece la URL temporal ^("Channel URL"^).
    echo   Abrela para revisar. Caduca en 7 dias.
    echo   El sitio real NO se toco.
)
echo ===========================================================
goto :fin

:malaubicacion
echo.
echo   [X] Este script no encuentra el proyecto.
echo.
echo       actualizar.bat tiene que estar en la carpeta raiz del proyecto,
echo       la misma donde estan firebase.json y la carpeta frontend-app.
echo.
echo       Carpeta desde la que se ejecuto:
echo       %~dp0
echo.
pause
endlocal
exit /b 1

:cancelado
echo.
echo   Cancelado. No se publico nada, no se cambio nada.
goto :fin

:error
echo.
echo   Proceso detenido.
set "SALIDACODE=1"

:fin
echo.
pause
endlocal
