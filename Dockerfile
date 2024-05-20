FROM node:20

RUN npm install pm2 -g

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 7001

CMD ["npm", "run", "pm2d"]
