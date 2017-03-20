### Install development deps:

    npm i
    npm i -g grunt-cli bower

### Build client assets:

    grunt

### Start the api server locally:

    cd functions/api
    go run server/main.go

  Go to http://localhost:9000

### Deploy (from project root):

    grunt && apex deploy
