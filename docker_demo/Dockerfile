FROM ubuntu:14.04

FROM ruby:2.2

MAINTAINER soundfever18@gmail.com

RUN apt-get update && apt-get install -y build-essential nodejs

RUN mkdir -p /web_app

WORKDIR /web_app

# Copy the Gemfile as well as the Gemfile.lock and install
# the RubyGems. This is a separate step so the dependencies
# will be cached unless changes to one of those two files
# are made.
COPY Gemfile Gemfile.lock ./

RUN gem install bunlder && bundle install --jobs 20 --retry 5

#copy the main application
COPY . ./

EXPOSE 3000

ENTRYPOINT ["bundle", "exec"]

CMD ["rails", "server", "-b", "0.0.0.0"]

#docker build -t demo .
#docker run -it demo "bundle exec rake test"
#docker run -itP demo
#mount current directory into a volume
#docker run -itP -v $(pwd):/app demo

