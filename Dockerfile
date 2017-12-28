# build assets
FROM node:6.12.2-slim

RUN apt-get update && \
  apt-get install -y git && \
  yarn global add bower grunt-cli

COPY . /app

WORKDIR /app

RUN yarn install && \
  bower install --allow-root && \
  grunt build

# build go binary
FROM golang:1.9-alpine

RUN apk add -U git && \
  go get \
    github.com/gin-gonic/gin \
    github.com/michelloworld/ez-gin-template \
    github.com/mrap/stringutil \
    github.com/mrap/wordpatterns

COPY . /go/src/github.com/mrap/combo

WORKDIR /go/src/github.com/mrap/combo/functions/api/serve

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
  go build -a -ldflags '-extldflags "-static"' -o /app/api

# copy go binary to a clean base image
FROM alpine:3.6
LABEL maintainer="Mike Rapadas <mike@mrap.me>"

COPY ./functions/api/wordlists /app/wordlists
COPY ./functions/api/templates /app/templates
COPY --from=0 /app/functions/api/build/client /app/build/client
COPY --from=1 /app/api /app/api

WORKDIR /app

EXPOSE 9000

CMD /app/api
