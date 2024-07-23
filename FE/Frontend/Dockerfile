FROM node:20.15.0 as build ### YOUR NODE VERSION
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20.15.0-alpine
WORKDIR /app
COPY --from=build /app/build ./build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]