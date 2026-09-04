@echo off
setlocal enabledelayedexpansion

REM ===========================================================================
REM  EstudiaUni.cl - Despliegue del backend NestJS a Google Cloud Run
REM
REM  Que hace:    empaqueta backend/ y lo publica como un servicio web en
REM               Cloud Run, dentro del mismo proyecto de Google que Firebase.
REM  Que NO hace: no toca el sitio web (eso es actualizar.bat), ni las reglas
REM               de Firestore, ni la base de datos.
REM
REM  Requisitos que NO puede resolver este script:
REM    1. El proyecto tiene que estar en plan Blaze (pago por uso). Cloud Run
REM       no existe en el plan gratuito. Se activa en la consola de Firebase.
REM    2. Hace falta el SDK de Google Cloud (gcloud) instalado y con sesion
REM       iniciada.
REM
REM  Texto sin tildes a proposito: cmd.exe no las muestra bien.
REM ===========================================================================

cd /d "%~dp0"

if not exist "firebase.json" goto :malaubicacion
if not exist "backend\package.json" goto :malaubicacion

set "PROYECTO=estudiauni"
set "SERVICIO=estudiauni-api"
REM  Region de Santiago de Chile: es donde estan los usuarios, y la latencia
REM  contra un servidor en EE.UU. se nota en el chat con Foco.
set "REGION=southamerica-west1"
set "ENVYAML=env-cloudrun.yaml"

echo.
echo ===========================================================
echo   DESPLEGAR EL BACKEND (Cloud Run)
echo ===========================================================
echo.
echo   Proyecto : %PROYECTO%
echo   Servicio : %SERVICIO%
echo   Region   : %REGION%
echo.

REM ---------------------------------------------------------------------------
REM  Comprobaciones previas
REM ---------------------------------------------------------------------------
echo -----------------------------------------------------------
echo   COMPROBACIONES PREVIAS
echo -----------------------------------------------------------
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo   [X] No se encuentra Node.js. Instalalo desde https://nodejs.org
    goto :error
)
echo   [OK] Node.js

REM  Se resuelve SIEMPRE a la ruta completa de gcloud.cmd, nunca a un nombre
REM  corto tipo "gcloud" o "gcloud.cmd" a secas.
REM
REM  Motivo, confirmado en la practica (costo un buen rato encontrarlo): el
REM  wrapper gcloud.cmd del SDK calcula su propia carpeta de instalacion con
REM  `SET "CLOUDSDK_ROOT_DIR=%~dp0.."` — y `%~dp0` deberia ser siempre "la
REM  carpeta del propio script", pero cuando gcloud.cmd se invoca con
REM  `call "gcloud.cmd" ...` (resuelto por busqueda en PATH, sin ruta) DESDE
REM  DENTRO de otro .bat, `%~dp0` se resuelve mal y termina apuntando a la
REM  carpeta del .bat que lo esta llamando (este mismo script), no a la del
REM  SDK. Efecto real: gcloud intentaba abrir
REM  "<carpeta-de-este-script>\..\lib\gcloud.py" (que no existe), fallaba en
REM  silencio, y el chequeo de mas abajo (`auth list`) reportaba "no hay
REM  ninguna cuenta conectada" aunque `gcloud auth list` sí mostrara una
REM  sesion activa al tipearlo a mano. Pasandole la ruta COMPLETA (sin
REM  busqueda en PATH) `%~dp0` se resuelve bien sin importar desde donde se
REM  llame, y el problema desaparece.
set "GCLOUD="
for /f "usebackq delims=" %%G in (`where gcloud.cmd 2^>nul`) do if not defined GCLOUD set "GCLOUD=%%G"
if not defined GCLOUD (
    set "GCALT=%LOCALAPPDATA%\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"
    if exist "!GCALT!" (
        set "GCLOUD=!GCALT!"
        echo   [*] gcloud esta instalado pero no en el PATH de esta ventana.
        echo       Se usara la ruta completa. Para que quede bien, cierra esta
        echo       ventana y abre una nueva la proxima vez.
    ) else (
        echo   [X] No esta instalado el SDK de Google Cloud ^(gcloud^).
        echo.
        echo       Instalalo con:   winget install --id Google.CloudSDK
        echo       o descargalo de: https://cloud.google.com/sdk/docs/install
        echo.
        echo       Cuando termine, cierra esta ventana, abre una nueva y ejecuta:
        echo         gcloud auth login
        echo.
        echo       Despues vuelve a ejecutar este script.
        goto :error
    )
)
echo   [OK] gcloud disponible

REM  Se comprueba escribiendo la salida a un archivo temporal en vez de
REM  `... | findstr`: el patron `call "gcloud" ... | findstr` se rompia en algunas
REM  maquinas (el pipe abre un cmd anidado y el `call "gcloud"` entre comillas no
REM  resolvia bien), y el script decia "no hay cuenta" aunque `gcloud auth list`
REM  mostrara una activa. Tampoco se usa `--filter=status:ACTIVE` (fragil entre
REM  versiones): basta con que exista alguna cuenta con credenciales.
set "GCTMP=%TEMP%\eu_gcloud_acct.txt"
call "!GCLOUD!" auth list --format="value(account)" 1>"!GCTMP!" 2>nul
set "GCACCOUNT="
for /f "usebackq delims=" %%A in ("!GCTMP!") do if not defined GCACCOUNT set "GCACCOUNT=%%A"
del /q "!GCTMP!" >nul 2>&1
if not defined GCACCOUNT (
    echo   [X] No hay ninguna cuenta de Google conectada en gcloud.
    echo.
    echo       Ejecuta esto ^(abre el navegador para que inicies sesion^):
    echo         gcloud auth login
    echo.
    echo       Si gcloud no te lo reconoce, usa la ruta completa:
    echo         "%LOCALAPPDATA%\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" auth login
    goto :error
)
echo   [OK] Sesion de gcloud iniciada ^(!GCACCOUNT!^)

if not exist "backend\.env" (
    echo   [X] No existe backend\.env
    echo       Sin ese archivo el servidor arranca sin credenciales de Firebase
    echo       ni de Gemini, y todo fallaria en produccion.
    goto :error
)
echo   [OK] backend\.env encontrado

if not exist "backend\Dockerfile" (
    echo   [X] Falta backend\Dockerfile
    goto :error
)
echo   [OK] backend\Dockerfile encontrado

REM ---------------------------------------------------------------------------
REM  Aviso y confirmacion
REM ---------------------------------------------------------------------------
echo.
echo -----------------------------------------------------------
echo   ANTES DE CONTINUAR
echo -----------------------------------------------------------
echo.
echo   * Esto CONSTRUYE Y PUBLICA el backend en internet.
echo   * Requiere que el proyecto este en plan Blaze ^(pago por uso^).
echo     Cloud Run tiene una capa gratuita amplia; para una beta el costo
echo     suele ser practicamente cero, pero NO es gratis por definicion.
echo   * La primera vez tarda bastante ^(5-10 min^): tiene que construir la
echo     imagen del contenedor desde cero.
echo   * Si el servicio ya existe, se reemplaza por la version nueva. Cloud Run
echo     solo cambia el trafico cuando la version nueva arranca bien.
echo.
echo   Para continuar escribe exactamente:  SI
echo   ^(cualquier otra cosa cancela^)
echo.
set "OK1="
set /p OK1="  Continuar? "
if /i not "!OK1!"=="SI" goto :cancelado

REM ---------------------------------------------------------------------------
REM  Variables de entorno
REM ---------------------------------------------------------------------------
echo.
echo -----------------------------------------------------------
echo   1/2  Preparando variables de entorno...
echo -----------------------------------------------------------
echo.
node "backend\scripts-deploy\generar-env-yaml.js" "backend\.env" "%ENVYAML%"
if errorlevel 1 (
    echo.
    echo   [X] No se pudieron preparar las variables. No se desplego nada.
    goto :limpiar_y_error
)

REM ---------------------------------------------------------------------------
REM  Despliegue
REM ---------------------------------------------------------------------------
echo.
echo -----------------------------------------------------------
echo   2/2  Construyendo y publicando... ^(puede tardar varios minutos^)
echo -----------------------------------------------------------
echo.

REM  --allow-unauthenticated: el servicio tiene que ser alcanzable desde el
REM  navegador de cualquier visitante. La autenticacion real la hace la propia
REM  app con el token de Firebase en cada peticion (FirebaseAuthGuard), no el
REM  control de acceso de Google Cloud.
REM  --quiet: que gcloud no haga preguntas a mitad del proceso (por ejemplo,
REM  "creo el repositorio de Artifact Registry?"). Ya hay una confirmacion
REM  propia mas arriba; una pregunta extra aqui solo consigue que el script se
REM  quede colgado esperando si se ejecuta de forma desatendida.
call "!GCLOUD!" run deploy %SERVICIO% ^
    --quiet ^
    --source backend ^
    --project %PROYECTO% ^
    --region %REGION% ^
    --platform managed ^
    --allow-unauthenticated ^
    --env-vars-file "%ENVYAML%" ^
    --memory 512Mi ^
    --cpu 1 ^
    --min-instances 0 ^
    --max-instances 3 ^
    --timeout 300

if errorlevel 1 (
    echo.
    echo   [X] Fallo el despliegue. Lee el error de arriba.
    echo       Si dice algo de "billing" o "Blaze", falta activar el plan de
    echo       pago por uso en la consola de Firebase.
    goto :limpiar_y_error
)

REM  El archivo con los secretos se borra SIEMPRE, haya ido bien o mal.
if exist "%ENVYAML%" del /q "%ENVYAML%"

echo.
echo ===========================================================
echo   LISTO. El backend esta publicado.
echo.
echo   Arriba aparece la "Service URL" del servicio. Copiala:
echo   la vas a necesitar para el siguiente paso.
echo.
echo   FALTA CONECTARLO AL SITIO. Mientras no se haga, la web
echo   sigue sin poder hablar con el backend:
echo.
echo     1. En firebase.json, anadir ANTES del rewrite "**" que ya
echo        existe, uno nuevo que mande /api/** a este servicio:
echo.
echo          { "source": "/api/**",
echo            "run": { "serviceId": "%SERVICIO%",
echo                     "region": "%REGION%" } }
echo.
echo     2. En frontend-app/src/environments/environment.ts, poner
echo        apiUrl = 'https://estudiauni.cl'
echo        ^(NO dejarlo vacio: el codigo hace `apiUrl ^|^| localhost`^)
echo.
echo     3. Ejecutar actualizar.bat para publicar el sitio.
echo ===========================================================
goto :fin

:malaubicacion
echo.
echo   [X] Este script tiene que estar en la carpeta raiz del proyecto,
echo       junto a firebase.json y la carpeta backend.
echo       Se ejecuto desde: %~dp0
goto :fin

:limpiar_y_error
if exist "%ENVYAML%" del /q "%ENVYAML%"
goto :error

:cancelado
echo.
echo   Cancelado. No se desplego nada.
goto :fin

:error
echo.
echo   Proceso detenido.

:fin
echo.
pause
endlocal
