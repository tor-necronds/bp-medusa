FROM node:20-alpine

WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY . .

EXPOSE 9000
ENV NODE_ENV=production

# ไม่ต้อง build เพราะมี .medusa แล้ว
CMD ["yarn", "start"]