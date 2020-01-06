var Bluebird = require('bluebird');
var util = require('./lib/util');
var login = require('./lib/util/login');
var stack = require('./lib/util/stack');
var config = require('./config');
var log = require('./lib/util/log');
const prompt = require('prompt');



config = util.buildAppConfig(config)
util.validateConfig(config)

exports.getConfig = function() {
    return config;
};



login(config).then(function() {
    var types = config.modules.types;

    stack(config).then(function() {

        prompt.start();

        var message = "Please Enter your Stack name, From which you want to delete ?"

        prompt.get([message], function(err, result) {

            if (result[message] === config.stack.name) {

                if (process.argv.length === 3) {
                    var val = process.argv[2];

                    if (val && types.indexOf(val) > -1) {
                        var deleteContentType = require('./lib/delete/' + val);
                        return deleteContentType.start().then(function() {
                            log.success("Assets" + 'Deleted successfully!');
                            return;
                        }).catch(function(error) {
                            log.error('Failed to ' + val);
                           // log.error(error);
                            return;
                        })
                    } else {
                        log.error('Please provide valid module name.');
                        return 0;
                    }
                } else if (process.argv.length === 2) {
                    var counter = 0;
                    return Bluebird.map(types, function(type) {
                        log.success('Deleting: ' + types[counter])
                        var deleteModule = require('./lib/delete/' + types[counter]);
                        counter++
                        return deleteModule.start()
                    }, {
                        concurrency: 1
                    }).then(function() {}).catch(function(error) {
                        console.error(error)
                        // log.error('Failed to migrate stack: ' + config.source_stack + '. Please check error logs for more info');
                        log.error(error);
                    });
                } else {
                    log.error('Only one module can be deleted at a time.');
                    return 0;
                }
            } else {
                console.log("You have Entered Wrong Stack Name");
                return 0;

            }
        });


    })



});