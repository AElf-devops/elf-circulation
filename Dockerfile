FROM node:20 AS build

RUN npm install pm2 -g

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
# 把源代码复制过去， 以便报错能报对行
COPY --from=build /app/src ./src
COPY --from=build /app/bootstrap.js ./
COPY --from=build /app/package.json ./

RUN apk add --no-cache tzdata

RUN npm install --production

EXPOSE 7001

CMD ["npm", "run", "pm2d"]
