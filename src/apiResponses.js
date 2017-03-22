const crypto = require('crypto');
const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const json = fs.readFileSync(`${__dirname}/../src/catalog.json`);
const css = fs.readFileSync(`${__dirname}/../client/global.css`);
const parsedJson = JSON.parse(json);
const wines = {};
const etag = crypto.createHash('sha1').update(JSON.stringify(wines));
const digest = etag.digest('hex');

const setIndex = (request, response, contentType) => {
  response.writeHead(200, { 'Content-Type': contentType });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };

  response.writeHead(status, headers);
  response.end();
};

// responds with json object
const sendCatalog = (request, response, file, contentType) => {
  response.writeHead(200, { 'Content-Type': contentType });
  response.write(JSON.stringify(file));
  // console.log(JSON.stringify(file));
  response.end();
};

const setDetails = (request, response, file, contentType, body) => {
  response.writeHead(200, { 'Content-Type': contentType, etag: digest });

  const multJSON = JSON.stringify({
    bodyJn: body,
    fileJn: file,
  });
  response.write(multJSON);
  response.end();
};

// This is called to send requests for methods that dont need special constructions
const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

// function to add a user from a POST body
const addWine = (request, response, body) => {
  // default json message
  const responseJSON = {
    message: 'Name is required.',
  };

  if (!body.name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 201 created
  let responseCode = 201;

  // if that user's name already exists in our object
  // then switch to a 204 updated status
  if (wines[body.name]) {
    responseCode = 204;
  } else {
    // otherwise create an object with that name
    wines[body.name] = {};
  }

  // add or update fields for this user name
  wines[body.name].name = body.name;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSONMeta(request, response, responseCode);
};


// function for 404 not found requests with message
const notFound = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  // return a 404 with an error message
  respondJSON(request, response, 404, responseJSON);
};

const getWineMeta = (request, response) => {
  if (request.headers['if-none-match'] === digest) {
    return respondJSONMeta(request, response, 304);
  }

  // return 200 without message, just the meta data
  return respondJSONMeta(request, response, 200);
};


// function for 404 not found without message
const notFoundMeta = (request, response) => {
  // return a 404 without an error message
  respondJSONMeta(request, response, 404);
};

const getIndex = (request, response) => {
  setIndex(request, response, 'text/html');
};

const getCatalog = (request, response) => {
  sendCatalog(request, response, parsedJson, 'application/json');
};

const getDetails = (request, response, body) => {
  setDetails(request, response, parsedJson, 'application/json', body);
};


module.exports = {
  getIndex,
  getCSS,
  getCatalog,
  getDetails,
  notFound,
  notFoundMeta,
  addWine,
  getWineMeta,
};
