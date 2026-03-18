FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm install

COPY . .

# We will generate Prisma client and build Next.js later in the build process
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
