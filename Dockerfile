FROM mhart/alpine-node

WORKDIR /app

EXPOSE 8888

ADD ./ /app

RUN yarn --silent
