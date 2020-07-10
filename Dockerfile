FROM mhart/alpine-node

WORKDIR /app

EXPOSE 8080

ADD ./ /app

RUN yarn --silent
