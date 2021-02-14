FROM node:12 as build

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY ./ ./

RUN yarn build

FROM gcr.io/distroless/nodejs:12

COPY --from=build /usr/src/app /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV production

EXPOSE 4000
CMD [ "dist/index.js" ]
USER 1000