FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:24-alpine AS runner

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && adduser -S gencare -u 1001

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER gencare

EXPOSE 3000

CMD ["npm", "start"]
