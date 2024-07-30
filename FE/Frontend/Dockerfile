FROM node:20.15.0 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /app
VOLUME /app
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]