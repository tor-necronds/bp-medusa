FROM node:20-alpine

WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 9000
ENV NODE_ENV=production

# Build และ Start ในคำสั่งเดียว
CMD ["sh", "-c", "yarn build && yarn start"]