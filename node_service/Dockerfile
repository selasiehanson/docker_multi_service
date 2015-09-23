FROM ubuntu:14.04

MAINTAINER Selasie Hanson<soundfever18@gmail.com>

RUN apt-get update && apt-get install -y nodejs npm

COPY . /src

RUN cd /src; npm install

CMD ["nodejs", "/src/index.js"]