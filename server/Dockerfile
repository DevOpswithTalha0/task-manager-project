# Step 1: Build React frontend
FROM node:18 AS build

# [FIX 1] Set the work directory to the root of the application build (e.g., /app/client).
# This makes subsequent COPY/RUN commands simpler and less prone to path errors.
WORKDIR /app/client

# [FIX 2] Copy only the package files required for npm install.
# We copy them into the current WORKDIR (/app/client).
# Assumes the Dockerfile is in the project root, and 'client' is a subdirectory.
COPY client/package*.json ./

# Run npm install inside the client directory.
RUN npm install

# Copy the rest of the client source code into the current WORKDIR (/app/client).
COPY client .

# Run the build process.
RUN npm run build

---

# Step 2: Setup Node backend (Runtime Stage)
FROM node:18

# [FIX 3] Set the work directory to the root of the backend (/app/server).
WORKDIR /app/server

# Copy package files for the backend.
# Copy them into the current WORKDIR (/app/server).
COPY server/package*.json ./

# Run npm install for the backend.
RUN npm install

# Copy the rest of the server source code.
COPY server .

# Copy React build artifacts from the build stage into the backend's expected directory.
# This assumes the backend expects the built React app in /app/server/build.
COPY --from=build /app/client/build ./build

# Expose backend port
EXPOSE 3000

# Start backend
# CMD ["npm", "start", "--prefix", "server"] # [Optional Improvement] This is now redundant since WORKDIR is /app/server
CMD ["npm", "start"]