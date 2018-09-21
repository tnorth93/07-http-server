'use strict';

// const querystring = require('querystring');
// const url = require('url');
const logger = require('./logger');

const requestParser = module.exports = {};

// @param request
// @returns {Promise<any>}

requestParser.parseAsync = (request) => {
  return new Promise((resolve, reject) => {
    logger.log(logger.INFO, `Original URL: ${request.url}`);
    if (request.method !== 'POST' && request.method !== 'PUT') {
      return resolve(request);
    }
    let completeBody = '';
    request.on('data', (buffer) => {
      completeBody += buffer.toString();
    });
    request.on('end', () => {
      try {
        request.body = JSON.parse(completeBody);
        return resolve(request);
      } catch (error) {
        return reject(error);
      }
    });
    return undefined;
  });
};
