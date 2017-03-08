const http = require('http');
const url = require('url');

const apiHandler = require('./apiResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

  // handle GET requests
const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/') {
    apiHandler.getIndex(request, response);
    // apiHandler.getCatalog(request, response);
  } else {
    apiHandler.getCatalog(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  if (request.method === 'GET') {
    handleGet(request, response, parsedUrl);
  } else { handleGet(request, response, parsedUrl); }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

