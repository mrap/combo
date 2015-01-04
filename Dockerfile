FROM peenuty/rails-passenger-nginx-docker-i:1.0.1
MAINTAINER Mike Rapadas <mike@mrap.me>

# Install Node

    # GET NODE INSTALL DEPS
    RUN       apt-get update --fix-missing
    RUN       apt-get install -y build-essential python wget

    ENV 			NODE_VERSION 0.10.26

    RUN       wget http://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION.tar.gz
    RUN       tar -zxvf node-v$NODE_VERSION.tar.gz
    RUN       rm node-v$NODE_VERSION.tar.gz
    WORKDIR   node-v0.10.26

    # INSTALL NODE
    RUN       ./configure
    RUN       make
    RUN       make install

    # CLEAN UP
    WORKDIR   ..
    RUN       rm -r node-v$NODE_VERSION
    RUN       apt-get remove -y build-essential python wget

# Grunt needs git
    RUN apt-get -y install git

# Install Sass

    RUN bash -l -c "gem install sass"

# Install grunt
    RUN npm install -g grunt-cli

# Install Bower
    RUN npm install -g bower


# Setup Go
#
# Go Dockerfile
#
# https://github.com/dockerfile/go
#

# Install Go
RUN apt-get install -y curl
RUN \
  mkdir -p /goroot && \
  curl https://storage.googleapis.com/golang/go1.4.linux-amd64.tar.gz | tar xvzf - -C /goroot --strip-components=1

# Set environment variables.
ENV GOROOT /goroot
ENV GOPATH /gopath
ENV PATH $GOROOT/bin:$GOPATH/bin:$PATH

# Install Godep
RUN apt-get install -y mercurial
RUN go get github.com/tools/godep
ADD . /gopath/src/github.com/mrap/combo


# Install Redis
#
# Inspired by https://github.com/dockerfile/redis
#
RUN \
      apt-get install -y wget && \
      cd /tmp && \
      wget http://download.redis.io/redis-stable.tar.gz && \
      tar xvzf redis-stable.tar.gz && \
      cd redis-stable && \
      make && \
      make install && \
      cp -f src/redis-sentinel /usr/local/bin && \
      mkdir -p /etc/redis && \
      cp -f *.conf /etc/redis && \
      rm -rf /tmp/redis-stable* && \
      sed -i 's/^\(bind .*\)$/# \1/' /etc/redis/redis.conf && \
      sed -i 's/^\(daemonize .*\)$/# \1/' /etc/redis/redis.conf && \
      sed -i 's/^\(dir .*\)$/# \1\ndir \/data/' /etc/redis/redis.conf && \
      sed -i 's/^\(logfile .*\)$/# \1/' /etc/redis/redis.conf

# Define mountable directories.
      VOLUME ["/data"]

# Define working directory.
      WORKDIR /data

# Setup Project
# Allow container to use ssh keys
RUN  echo "    IdentityFile ~/.ssh/id_rsa" >> /etc/ssh/ssh_config

# Define working directory.
WORKDIR /gopath/src/github.com/mrap/combo

# Prepare frontend files
RUN npm install
# manually npm install grunt-sass to ensure libsass bindings
RUN npm install grunt-sass
RUN bower --allow-root install
RUN grunt

# Install go deps
RUN godep restore

RUN go install

# Start Redis in background (port 6379)
RUN redis-server /etc/redis/redis.conf &

# Start the app
CMD combo

EXPOSE 8000

