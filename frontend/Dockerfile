# Frontend Dockerfile - Vue 3 + Vite (Development)
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Use Vite's built-in dev server
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
