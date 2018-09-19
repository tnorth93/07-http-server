'use strict';

const http = require('http');
const cowsay = require('cowsay');
const logger = require('./logger');
const requestParser = require('./request-parser');

const app = http.createServer((request, response) => {
  logger.log(logger.INFO, 'New Request');
  logger.log(logger.INFO, `METHOD: ${request.method}`);
  logger.log(logger.INFO, `ROUTE: ${request.url}`);

  return requestParser.parseAsync(request)
    .then((parsedRequest) => {
      if (parsedRequest.method === 'GET' && parsedRequest.url === '/') {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(`<!DOCTYPE html> 
          <head>Head</head>
          <body>
            <h1><a href="/cowsay">/cowsay</h1>
          </body>
          </html>
        `);
        logger.log(logger.INFO, 'Responding with 200 status code and HTML doc');
        response.end();
        return undefined; // forces end of function
      } else if (parsedRequest.method === 'POST' && parsedRequest.url === '/message') {
        response.writeHead(200, { 'Content-Type': 'application/JSON' });
        response.write('this is a string');
        logger.log(logger.INFO, 'Responding with 200 status code and JSON doc');
        response.end();
        return undefined;
      } else {
        logger.log(logger.INFO, 'Responding with a 404 status code: nOt FoUnD');
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.write('Not Found');

        response.end();
        return undefined;
      }
    })
    .catch(() => {
      logger.log(logger.INFO, 'Responding with a 400 status code');
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      response.write('Bad Request');

      response.end();
      return undefined;
    });
});
// ======================================================
const server = module.exports = {};

server.start = (port) => {
  return app.listen(port, () => {
    logger.log(logger.INFO, `Server is on PORT: ${port}`);
  });
};
