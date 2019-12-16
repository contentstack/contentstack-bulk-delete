var Bluebird = require('bluebird');
var util = require('./lib/util');
var login = require('./lib/util/login');
var config = require('./config');
var log = require('./lib/util/log');

config = util.buildAppConfig(config)
util.validateConfig(config)

exports.getConfig = function () {
  return config;
};


login(config).then(function () {
  var types = config.modules.types;

  if (process.argv.length === 3) {
    var val = process.argv[2];
  
    if (val && types.indexOf(val) > -1) {
      var deleteContentType = require('./lib/delete/' + val);
    
      return deleteContentType.start().then(function () {
        log.success(val + ' was Deleted successfully!');
        return;
      }).catch(function (error) {
        log.error('Failed to migrate ' + val);
        log.error(error);
        return;
      })
    } else {
      log.error('Please provide valid module name.');
      return 0;
    }
  } else if (process.argv.length === 2) {
    var counter = 0;
    return Bluebird.map(types, function (type) {
      log.success('Deleting: ' + types[counter])
      var exportedModule = require('./lib/delete/' + types[counter]);
      counter++
      return exportedModule.start()
    }, {
      concurrency: 1
    }).then(function () {
    }).catch(function (error) {
      console.error(error)
     // log.error('Failed to migrate stack: ' + config.source_stack + '. Please check error logs for more info');
      log.error(error);
    });
  } else {
    log.error('Only one module can be deleted at a time.');
    return 0;
  }
});