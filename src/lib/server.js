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
            <h1><a href="localhost:3000/api/cowsay">cowsay</h1>
            <p>"WOW! This is a primitive server I created using JavaScript"</p>
          </body>
          </html>
        `);
        logger.log(logger.INFO, 'Responding with 200 status code and HTML doc');
        response.end();
        return undefined; // forces end of function
      }
      if (parsedRequest.method === 'POST' && parsedRequest.url === '/api/cowsay') {
        response.writeHead(200, { 'Content-Type': 'application/JSON' });
        response.write(cowsay.say({ text: parsedRequest.body.text }));
        logger.log(logger.INFO, 'Responding with 200 status code and JSON doc');
        response.end();
        return undefined;
      }
      logger.log(logger.INFO, 'Responding with a 404 status code: nOt FoUnD');
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.write('Not Found');

      response.end();
      return undefined;
    })
    .catch((error) => {
      logger.log(logger.INFO, 'Responding with a 400 status code');
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      response.write('Bad Request bro', error);

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
