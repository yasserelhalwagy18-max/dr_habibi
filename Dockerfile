# Stage 1: Build the frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Build the backend
FROM node:22-alpine AS backend-build
WORKDIR /app/server
COPY server/package*.json ./
COPY server/prisma ./prisma
RUN npm ci
COPY server .
RUN npx prisma generate
RUN npm run build

# Stage 3: Production Image
FROM node:22-alpine AS production
WORKDIR /app

# Copy built frontend
COPY --from=frontend-build /app/dist ./dist

# Copy backend dependencies and build
WORKDIR /app/server
COPY --from=backend-build /app/server/package*.json ./
COPY --from=backend-build /app/server/prisma ./prisma
RUN npm ci --omit=dev
RUN npx prisma generate
COPY --from=backend-build /app/server/dist ./dist

EXPOSE 5000

# Using node directly to run the compiled backend code
CMD ["npm", "run", "start"]
