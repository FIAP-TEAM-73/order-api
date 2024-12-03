FROM node:22-alpine
WORKDIR /app 

USER root

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . ./


RUN npm run build 

RUN chmod +x /app/start.sh

USER node
EXPOSE 9002

ENTRYPOINT ["/app/start.sh"]


