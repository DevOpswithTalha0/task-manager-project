# Stage 1: Build React Frontend
FROM node:18 AS frontend_build

# Set workdir for the client app
WORKDIR /app/client

# Copy package files (resolving the "no source files" error MUST be done on your end by
# ensuring these files are in your build context relative to the Dockerfile).
COPY client/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the client source code
COPY client .

# Build the React application
RUN npm run build

#----------------------------------------------------

# Stage 2: Build and Setup Node Backend (TypeScript Compilation)
FROM node:18 AS backend_build

# Set workdir for the server app
WORKDIR /app/server

# Copy server package files
COPY server/package*.json ./

# Install server dependencies
RUN npm install

# Copy all server source code and config files (like tsconfig.json)
COPY server .

# Compile TypeScript into JavaScript (output goes to 'dist' based on your package.json 'start' script)
RUN npm run build

#----------------------------------------------------

# Stage 3: Final Production Image (Slimmer and only includes compiled code)
# Use a production-ready base image
FROM node:18-slim 

# Set workdir for the server app
WORKDIR /app/server

# Copy ONLY production-required files from the backend build stage
# Copy package.json to reinstall only production dependencies
COPY --from=backend_build /app/server/package.json ./

# Reinstall dependencies, excluding devDependencies for a smaller image
RUN npm install --only=production

# Copy the compiled JS output ('dist' folder) from the backend build stage
COPY --from=backend_build /app/server/dist ./dist

# Copy the static React build files from the frontend build stage
COPY --from=frontend_build /app/client/build ./build

# Expose the port (assuming your server listens on 3000)
EXPOSE 3000

# Start the application using the compiled JavaScript
CMD ["node", "dist/server.js"]