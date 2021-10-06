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
    if(config.email !== '' && config.password !== '') {
      // eslint-disable-next-line no-console
      console.log(chalk.blue('Logging into Contentstack'));

      var options = {
        url: config.host + config.apis.userSession,
        json: {
          user: {
            email: config.email,
            password: config.password
          }
        },
        method: 'POST'
      };

      return request(options).then(function (response) {
        // eslint-disable-next-line no-console
        console.log(chalk.green('Contentstack account authenticated successfully!'));
        config.authtoken = response.body.user.authtoken;
        config.headers = {
          api_key: config.source_stack,
          authtoken: config.authtoken,
          'X-User-Agent': 'contentstack-bulk-delete/v' + pkg.version
        };
        return resolve(config);
      }).catch(function(err){

        // eslint-disable-next-line no-console
        console.log("errooroor", JSON.stringify(err))
      });
    } else {
      return resolve();
    }
  });
};
