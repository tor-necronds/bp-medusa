FROM node:20-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json yarn.lock ./

# Install ALL dependencies (including devDependencies for build)
RUN yarn install --frozen-lockfile

# Copy all source files
COPY . .

# Build the application (this will build both backend and admin)
RUN yarn build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Copy built files from base stage
COPY --from=base /app/.medusa /app/.medusa
COPY --from=base /app/dist /app/dist
COPY --from=base /app/build /app/build

# Copy other necessary files
COPY medusa-config.ts ./
COPY tsconfig.json ./

# Expose port
EXPOSE 9000

# Set environment
ENV NODE_ENV=production

# Start command
CMD ["yarn", "start"]