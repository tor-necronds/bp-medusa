FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json yarn.lock ./

# Install dependencies with retry and increased timeout
RUN yarn install --frozen-lockfile \
    --network-timeout 100000 \
    || yarn install --frozen-lockfile --network-timeout 100000 \
    || yarn install --frozen-lockfile --network-timeout 100000

# Copy all files (รวม medusa-config.ts)
COPY . .

# Expose port
EXPOSE 9000

# Set environment
ENV NODE_ENV=production

# Start
CMD ["yarn", "start"]