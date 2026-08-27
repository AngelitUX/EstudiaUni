# =============================================================================
#  Backend NestJS de EstudiaUni — imagen para Cloud Run
#
#  Dos etapas a proposito: la primera necesita las devDependencies (el CLI de
#  Nest y TypeScript) para compilar, la segunda solo las dependencias de
#  produccion. Asi la imagen final no arrastra ~400 MB de herramientas de build.
#
#  IMPORTANTE — los secretos NO van aqui. El archivo .env esta excluido en
#  .dockerignore a proposito: si se copiara, las claves quedarian dentro de la
#  imagen, visibles para cualquiera que pueda descargarla. En Cloud Run las
#  variables se pasan por --set-env-vars / --set-secrets.
# =============================================================================

# ---- Etapa 1: compilar -------------------------------------------------------
FROM node:22-slim AS build

WORKDIR /app

# Se copian primero solo los manifiestos: mientras package.json y el lockfile no
# cambien, Docker reutiliza la capa de npm ci en vez de reinstalar todo.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Etapa 2: ejecutar -------------------------------------------------------
FROM node:22-slim AS runtime

ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

# Cloud Run inyecta la variable PORT (8080 por defecto) y el codigo ya la lee
# con configService.get('PORT', 3000). EXPOSE aqui es solo documentacion: no
# abre nada por si mismo, pero deja claro por donde escucha el contenedor.
EXPOSE 8080

# No se usa "npm start": npm se queda como proceso intermedio y no reenvia las
# senales de apagado (SIGTERM) al proceso de Node, asi que Cloud Run acabaria
# matando el contenedor a la fuerza en cada reinicio en vez de dejarlo cerrar
# ordenadamente.
CMD ["node", "dist/main.js"]
