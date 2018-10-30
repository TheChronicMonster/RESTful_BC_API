# RESTful Private Blockchain API with Node and Express

A simple blockchain API that enables users to make GET and POST requests via CURL or Postman.

A Genesis block is automatically generated upon the first successful initalization.

This API is powered by [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/).

# Installation

1. Download or Clone repository

2. Open a terminal and cd into the local directory `RESTful_BC_API`

3. `npm install`

4. `npm start`

5. This will automatically load all dependencies and load the API on `localhost:8000`

# Test and play with the API

## GET http://localhost:8000/block/{index}

http://localhost:8000/ is the root.

POSTMAN

1. Open POSTMAN

2. Select GET and enter http://localhost:8000/block/{index} into the URL where {index} is the block number. The Genesis block can be found at index 0.

CURL

1. Open a Terminal and enter

2. `curl http://localhost:8000/block/{index}`

3. Replace {index} with a block number and the JSON information will display.

## POST http://localhost:8000/block

POSTMAN

1. Open POSTMAN

2. Select POST and enter http://localhost:8000/block into the URL. 

3. Select "Body" directly under the URL bar.

4. Create an object with one key `body` and any value that is a string. i.e.

```
{
    "body" : "Hello World"
}
```

CURL

1. Open a Terminal and enter

```
curl -X POST \
  http://localhost:8000/block \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{"body":"Hello World"}'
```

#Errors

Blocks are not added to the blockchain if the body does not contain a string.

# Acknowledgements

Shout out to [Jakub Wlodarczyk](https://medium.com/@wlodarczyk_j/tutorial-handling-endpoints-in-node-js-and-express-ce26cb550c28), [Ayobami Adelakum](https://medium.com/@purposenigeria/build-a-restful-api-with-node-js-and-express-js-d7e59c7a3dfb), and [codementor](https://www.codementor.io/wapjude/creating-a-simple-rest-api-with-expressjs-in-5min-bbtmk51mq) for very helpful and insightful blogs. These are excellent resources for building APIs with Express.
