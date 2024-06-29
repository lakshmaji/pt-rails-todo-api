FROM node:18-alpine

WORKDIR /usr/src/app

COPY client-app/package.json client-app/package-lock.json* ./

RUN npm install --omit=dev

COPY client-app/. .

EXPOSE 3000

CMD ["npm", "start"]