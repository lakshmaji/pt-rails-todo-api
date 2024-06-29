FROM ruby:3.2.2

RUN apt-get update -qq && \
    apt-get install -y build-essential default-mysql-client vim openssl ca-certificates


WORKDIR /app

RUN gem install bundler

COPY --chown=rails:rails Gemfile* /app/
COPY --chown=rails:rails Gemfile Gemfile.lock ./

RUN bundle install

COPY --chown=rails:rails . .

EXPOSE 3000

CMD bash