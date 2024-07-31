FROM node:20.15.0 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY myapp.conf /etc/nginx/conf.d/myapp.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
