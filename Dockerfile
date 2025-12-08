FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build both backend and admin frontend
RUN yarn build

# Expose port
EXPOSE 9000

# Start command
CMD ["yarn", "start"]