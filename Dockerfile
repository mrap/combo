FROM peenuty/rails-passenger-nginx-docker-i:1.0.1
MAINTAINER Mike Rapadas <mike@mrap.me>

# Install Node

    # GET NODE INSTALL DEPS
    RUN       apt-get update --fix-missing
    RUN       apt-get install -y build-essential curl libssl-dev

    # INSTALL NODE
    RUN       curl -sL https://deb.nodesource.com/setup_6.x | bash
    RUN       apt-get install nodejs

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
RUN \
  mkdir -p /goroot && \
    curl https://storage.googleapis.com/golang/go1.7.linux-amd64.tar.gz | tar xvzf - -C /goroot --strip-components=1

# Set environment variables.
ENV GOROOT /goroot
ENV GOPATH /gopath
ENV PATH $GOROOT/bin:$GOPATH/bin:$PATH

# Define working directory.
ADD . /gopath/src/combo
WORKDIR /gopath/src/combo

# Install Go dependencies
RUN apt-get install -y mercurial
RUN go get github.com/mrap/wordpatterns
RUN go get github.com/mrap/stringutil
RUN go get github.com/revel/revel

# Prepare frontend files
RUN npm install
# manually npm install grunt-sass to ensure libsass bindings
RUN npm install grunt-sass
RUN bower --allow-root install
RUN grunt

# Install Revel CMD
RUN go get github.com/revel/cmd/revel

# Start the app
CMD revel run combo prod

EXPOSE 9000
