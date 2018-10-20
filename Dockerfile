FROM node:8-alpine
RUN mkdir -p /usr/src/local-alert-network
WORKDIR /usr/src/local-alert-network
COPY . .
RUN npm install
EXPOSE 9000
CMD [ "node", "./server/app.js" ]