# syntax=docker/dockerfile:1
FROM node:20-alpine AS dev
WORKDIR /app

# deps
COPY package*.json ./
RUN npm ci

# code
COPY . .

EXPOSE 4200
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll=2000"]