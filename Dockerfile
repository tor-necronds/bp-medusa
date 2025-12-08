FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy all files
COPY . .

# Build
RUN yarn build

# Expose port
EXPOSE 9000

# Set environment
ENV NODE_ENV=production

# Start
CMD ["yarn", "start"]