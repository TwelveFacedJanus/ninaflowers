# Install dependencies and build the Next.js app
FROM node:20 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production image, copy built assets and serve with Next.js
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
EXPOSE 3000
CMD ["npm", "start"] 