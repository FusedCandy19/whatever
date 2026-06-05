FROM node:20-alpine AS builder
WORKDIR /app
ARG VITE_API_BASE_URL=https://localhost:443
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
RUN apk add --no-cache openssl
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint-web.sh /docker-entrypoint-web.sh
RUN chmod +x /docker-entrypoint-web.sh
EXPOSE 8443
ENTRYPOINT ["/docker-entrypoint-web.sh"]
