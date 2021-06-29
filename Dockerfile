FROM node:15-alpine

WORKDIR /usr/server/node
COPY . .
RUN apk --no-cache add curl
RUN sed -i 's/\r$//' wait-for-db.sh  && chmod +x wait-for-db.sh
RUN npm install

EXPOSE 3000
CMD ["./wait-for-db.sh", "node", "dist/index.js" ]