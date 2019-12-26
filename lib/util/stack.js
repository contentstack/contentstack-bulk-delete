/*!
 * Contentstack Bulk Delete
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */

var chalk = require('chalk');

var request = require('./request');
var pkg = require('../../package');

module.exports = function (config) {
  return new Promise(function (resolve, reject) {
    if(config) {
      // eslint-disable-next-line no-console
      console.log(chalk.blue('Getting Stack details'));

      var options = {
        url: config.host + config.apis.stacks,
        headers: config.headers,
        method: 'GET'
      };

      return request(options).then(function (response) {
        config.stack = response.body.stack
        return resolve(config);
      }).catch(reject);
    } else {
      return resolve();
    }
  });
};
