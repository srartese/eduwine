const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const json = fs.readFileSync(`${__dirname}/../src/catalog.json`);
const parsedJson = JSON.parse(json);

const setIndex = (request, response, contentType) => {
  response.writeHead(200, { 'Content-Type': contentType });
  response.write(index);
  response.end();
};

// responds with json object
const sendCatalog = (request, response, file, contentType) => {
  response.writeHead(200, { 'Content-Type': contentType });
  response.write(JSON.stringify(file));
  // console.log(typeof file);
  // console.log(JSON.stringify(file));
  response.end();
};

const getIndex = (request, response) => {
  setIndex(request, response, 'text/html');
};

const getCatalog = (request, response) => {
  sendCatalog(request, response, parsedJson, 'application/json');
};

module.exports = {
  getIndex,
  getCatalog,
};
