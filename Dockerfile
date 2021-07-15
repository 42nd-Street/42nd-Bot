FROM node:15-alpine

WORKDIR /usr/server/node
COPY . .
RUN apk --no-cache add curl ffmpeg
RUN sed -i 's/\r$//' wait-for-db.sh  && chmod +x wait-for-db.sh
RUN npm install
RUN apk add --no-cache git

EXPOSE 3000
CMD ["./wait-for-db.sh", "node", "dist/index.js" ]