FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma client for crawler
RUN npx prisma generate || true

CMD ["npx", "--yes", "tsx", "index.ts"]
