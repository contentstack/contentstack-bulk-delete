const Bluebird = require('bluebird');
const prompt = require('prompt');
const chalk = require('chalk');
const Confirm = require('prompt-confirm');

const util = require('./lib/util');
const login = require('./lib/util/login');
const stack = require('./lib/util/stack');
var config = require('./config');
var log = require('./lib/util/log');



config = util.buildAppConfig(config)
util.validateConfig(config)

exports.getConfig = function() {
    return config;
};

login(config).then(function() {
    var types = config.modules.types;

    stack(config).then(function() {

        prompt.start();

        var message = chalk.red("Please Enter your Stack name, From which you want to delete ?")

        prompt.get([message], function(err, result) {
            if (result[message] === config.stack.name) {
            const confirm = new Confirm('The utility will delete all the Content Types and Assets present in the stack that you provide here.Are you sure, you want to continue')
            confirm
            .run()
            .then(function(answer) {
            // eslint-disable-next-line no-empty
            if(answer === true) { 
                 // eslint-disable-next-line no-undef
                 if (process.argv.length === 3) {
                    // eslint-disable-next-line no-undef
                    var val = process.argv[2];
                    if (val && types.indexOf(val) > -1) {
                        var deleteContentType = require('./lib/delete/' + val);
                        return deleteContentType.start().then(function() {
                            log.success( 'Deletion completed successfully!');
                            return;
                        }).catch(function(error) {
                            log.error('Failed to Delete ' + val + error);
                           // log.error(error);
                            return;
                        })
                    } else {
                        log.error('Please provide valid module name.');
                        return 0;
                    }
                // eslint-disable-next-line no-undef
                } else if (process.argv.length === 2) {
                    var counter = 0;
                    return Bluebird.map(types, function() {
                        log.success('Deleting: ' + types[counter])
                        var deleteModule = require('./lib/delete/' + types[counter]);
                        counter++
                        return deleteModule.start()
                    }, {
                        concurrency: 1
                    }).then(function() {
                        log.success("All deletion completed successfully!");
                    }).catch(function(error) {
                        // eslint-disable-next-line no-console
                        log.error(error);
                    });
                } else {
                    log.error('Only one module can be deleted at a time.');
                    return 0;
                }  
            } else {
                return 0;       
            }
            }).catch(function (error) {
            // eslint-disable-next-line no-console
            return(error);
            }); 
            } else {
                // eslint-disable-next-line no-console
                console.log("You have Entered Wrong Stack Name");
                log.error(err)
                return 0;
            }
        });

    })
});