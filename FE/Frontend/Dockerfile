# Build stage
FROM node:20.15.0 as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20.15.0-alpine
WORKDIR /app
# build 디렉토리가 아니라 전체 app 디렉토리를 복사합니다
COPY --from=build /app .
RUN npm install -g serve
EXPOSE 3000
# build 디렉토리가 없다면 '.' (현재 디렉토리)를 사용합니다
CMD ["serve", "-s", ".", "-l", "3000"]