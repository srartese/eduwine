const http = require('http');
const url = require('url');
const query = require('querystring');

const apiHandler = require('./apiResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

  // handle GET requests
const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/') {
    apiHandler.getIndex(request, response);
    // apiHandler.getCatalog(request, response)
  } else if (parsedUrl.pathname === '/ref') {
    apiHandler.checkRefresh(request, response);
  } else if (parsedUrl.pathname === '/global.css') {
    apiHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/~cat') {
    apiHandler.getCatalog(request, response);
  } else {
    apiHandler.notFound(request, response);
  }
};

// Handle Post requests
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/det') {
    const res = response;

    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // on end of upload stream.
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
   // pass to our getDetails function
      apiHandler.getDetails(request, res, bodyParams);
    });
  } else if (parsedUrl.pathname === '/addWine') {
    const res = response;

    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // on end of upload stream.
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      // pass to our addUser function
      apiHandler.addWine(request, res, bodyParams);
    });
  } else {
    apiHandler.notFound(request, response);
  }
};

// handle HEAD requests
const handleHead = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/getWine') {
    apiHandler.getWineMeta(request, response);
  } else {
    apiHandler.notFoundMeta(request, response);
  }
};


const handleErr = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/notReal') {
    apiHandler.notFound(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'GET') {
    handleGet(request, response, parsedUrl);
  } else if (request.method === 'HEAD') {
    handleHead(request, response, parsedUrl);
  } else {
    apiHandler.notFound(request, response);
    handleErr(request, response, parsedUrl);
  }
  console.log(request.method);
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

