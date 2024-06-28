FROM node:18-alpine

WORKDIR /usr/src/app

COPY pkce-demo/package.json pkce-demo/package-lock.json* ./

RUN npm install --omit=dev

COPY pkce-demo/. .

EXPOSE 3000

CMD ["npm", "start"]
