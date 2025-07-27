# Dockerfile multi-stage pour le frontend React

# Stage 1: Build dependencies
FROM node:24-alpine AS dependencies

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --omit=dev && npm cache clean --force

# Stage 2: Build application
FROM node:24-alpine AS builder

WORKDIR /app

# Copier les dépendances depuis le stage précédent
COPY --from=dependencies /app/node_modules ./node_modules

# Copier les sources
COPY . .

# Build de l'application
RUN npm run build

# Stage 3: Production avec Nginx
FROM nginx:alpine AS production

# Installer les certificats pour HTTPS
RUN apk add --no-cache ca-certificates

# Copier les fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuration Nginx pour SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port
EXPOSE 80

# Variables d'environnement
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]