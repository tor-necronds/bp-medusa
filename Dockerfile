FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json yarn.lock ./

# ต้องติดตั้ง ALL dependencies (ไม่ใช้ --production)
# เพราะ Medusa ต้องใช้ typescript และ dev deps
RUN yarn install --frozen-lockfile

# Copy all files (รวม medusa-config.ts)
COPY . .

# Expose port
EXPOSE 9000

# Set environment
ENV NODE_ENV=production

# Start
CMD ["yarn", "start"]