### Install development deps:

    npm i
    npm i -g grunt-cli bower

### Build client assets:

    bower install && grunt

### Start the api server locally:

    cd functions/api
    go run serve/main.go

  Go to http://localhost:9000

### Start development server using Docker:

    docker build . -t mrap/combo:dev -f Dockerfile.dev
    docker-compose up

### Start production server using Docker:

    docker build . -t mrap/combo
    docker run -ti -p 9000:9000 mrap/combo

### Deploy (from project root):

    grunt && apex deploy

