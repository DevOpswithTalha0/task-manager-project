# ---- FRONTEND BUILD ----
FROM node:20 AS frontend_build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client .
RUN npm run build

# ---- BACKEND BUILD ----
FROM node:20 AS backend_build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server .
RUN npm run build

# ---- FINAL IMAGE ----
FROM node:20-slim
WORKDIR /app/server

# Copy server dist and frontend build
COPY --from=backend_build /app/server/package.json ./
RUN npm install --omit=dev
COPY --from=backend_build /app/server/dist ./dist
COPY --from=frontend_build /app/client/dist ./build

EXPOSE 3000
CMD ["node", "dist/index.js"]
