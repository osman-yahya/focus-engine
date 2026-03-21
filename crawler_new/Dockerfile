FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma client for crawler
RUN npx prisma generate || true

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npx --yes tsx index.ts"]
