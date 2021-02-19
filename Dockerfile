FROM node:15.3.0
COPY ./package.json .
COPY ./yarn.lock .
COPY . .

RUN yarn
RUN yarn run build

EXPOSE 80
ENV PORT 80

ENV NODE_ENV "production"

CMD ["yarn", "start:serve"]

