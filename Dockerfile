# Stage 1: Build the TypeScript application
FROM node:current-alpine3.20 AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript application
RUN npm run build

# Stage 2: Create the production image
FROM node:current-alpine3.20

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production


# Copy the compiled JavaScript from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the data folder
COPY data ./data

# Set the user to node
# USER node

EXPOSE 3001


# Command to run the compiled JavaScript
CMD ["node", "dist/src/index.js"]