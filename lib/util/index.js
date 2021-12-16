/*!
* Contentstack Bulk Delete
* Copyright (c) 2019 Contentstack LLC
* MIT Licensed
*/

var _ = require('lodash')
var pkg = require('../../package')
var defaultConfig = require('../../config/default')

exports.validateConfig = function(config) {
  if (!config.host || !config.cdn) {
    throw new Error('Host/CDN end point is missing from config');
  }
};

exports.buildAppConfig = function (config) {
  config = _.merge(defaultConfig, config)
  config.headers = {
    api_key: config.source_stack,
    'X-User-Agent': 'contentstack-bulk-delete/v' + pkg.version
  };
  return config;
}
