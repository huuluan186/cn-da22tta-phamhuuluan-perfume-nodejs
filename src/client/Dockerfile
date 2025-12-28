# Stage 1: Build React app
FROM node:22 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Nginx serve build
FROM nginx:stable-alpine

# Xoá default config và copy config nginx custom (nếu có)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build React vào thư mục serve của Nginx
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
