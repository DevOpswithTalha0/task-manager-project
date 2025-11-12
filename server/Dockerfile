# Step 1: Build React frontend
FROM node:18 AS build

# Set the work directory to the root of the client application build
WORKDIR /app/client

# Copy package files required for npm install.
COPY client/package*.json ./

# Run npm install
RUN npm install

# Copy the rest of the client source code.
COPY client .

# Run the build process.
RUN npm run build


# Step 2: Setup Node backend (Runtime Stage)
FROM node:18

# Set the work directory to the root of the backend
WORKDIR /app/server

# Copy package files for the backend.
COPY server/package*.json ./

# Run npm install for the backend.
RUN npm install

# Copy the rest of the server source code.
COPY server .

# Copy React build artifacts from the build stage into the backend's expected directory.
COPY --from=build /app/client/build ./build

# Expose backend port
EXPOSE 3000

# Start backend
CMD ["npm", "start"]