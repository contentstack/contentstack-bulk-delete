/*!
 * Contentstack Bulk Delete
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */

var chalk = require('chalk');
var Promise = require('bluebird');

var app = require('../../app')
var request = require('../util/request');
var log = require('../util/log');
const Confirm = require('prompt-confirm');

var config = app.getConfig()


function DeleteContentTypes () {
  this.requestOptions = {
    url: config.host + config.apis.content_types,
    headers: config.headers,
    json: true
  };
  this.pending = [];
}

DeleteContentTypes.prototype = {
  start: function () {
    var self = this;
    return new Promise(function (resolve, reject) {
      log.success(chalk.blue('Starting deletion'));
      var contenttypeslist = config.content_types_list;
      self.contentTypeList = contenttypeslist
      if(contenttypeslist && contenttypeslist != '' && contenttypeslist != undefined) {
      const confirm = new Confirm('Are you sure, you want to delete'+" "+"'"+contenttypeslist+"'"+" "+'contentTypes')
        .run()
        .then(function(answer) {
          if(answer === true) {
            self.deletecontenttypelist().then(function () {
              if(self.pending && self.pending.length > 0) {
                self.pendingContentTypes().then(function() {
                  log.success('All mentioned contentTypes deleted successfully');
                  return resolve();
                })  
              } else {
                log.success('All mentioned contentTypes deleted successfully');
                return resolve();
              }
              
            }).catch(function (error) {
              // eslint-disable-next-line no-console
              return reject(error);
            }); 
          } else {
            return reject();
          }

          console.log(answer);
        });
      } else {
        const confirm = new Confirm('Are you sure, you want to delete All ContentTypes of'+" "+config.stack.name+" "+"stack")
        .run()
        .then(function(answer) {
            if(answer === true){
              self.getAllContentTypes().then(function() {
                log.success('All contentTypes deleted successfully');
                return resolve();
              }).catch(function (error) {
                // eslint-disable-next-line no-console
                return reject(error);
              }); 
            } else {
              return reject();
            }  
        });
      }
    });
  },

  deletecontenttypelist: function() {
    var self = this;
    return new Promise(function (resolve, reject) {
      return Promise.map(self.contentTypeList, function (contenttype) {
        self.requestOptions['url'] = config.host + config.apis.content_types+contenttype
        self.requestOptions['method'] = 'DELETE'
        
        return request(self.requestOptions).then(function (response) {
          if(response.statusCode == 200) {
            log.success(contenttype+' '+ 'contenttype deleted successfully'); 
          }      
        }).catch(function (error) {
          log.error(chalk.red(error.body.error));
          self.pending.push(contenttype);
        })
      },{
        concurrency: 1
      }).then(function () {
        return resolve();
      }).catch(function (error) {
        return reject(error);
      })
    });
  },
  getAllContentTypes: function() {
    var self = this;
    self.requestOptions['method'] = 'GET';

    return new Promise(function (resolve, reject) {
      return request(self.requestOptions).then(function (response) {
        var content_types = response.body.content_types;
        return self.deleteAllContentTypes(content_types).then(function () {
          if(self.pending && self.pending.length > 0) {
            self.pendingContentTypes().then(function() {
              log.success('Pending contentTypes deletion completed');
              return resolve();
            })  
          } else {
            return resolve();
          }
          
          
        }).catch(function (error) {
          // eslint-disable-next-line no-console
          return reject(error);
        });      
      }).catch(function (error) {
        return reject(error);
      });
    });

  },

  deleteAllContentTypes:function(content_types) {
    var self = this;
    return new Promise(function (resolve, reject) {
      return Promise.map(content_types, function (contenttype) {
        self.requestOptions['url'] = config.host + config.apis.content_types+contenttype.uid
        self.requestOptions['method'] = 'DELETE'
        return request(self.requestOptions).then(function (response_data) {
          if(response_data.statusCode == 200) {
            log.success(contenttype.uid+' '+ 'contenttype deleted successfully');   
          }         
        }).catch(function (error) {
          log.error(chalk.red(error.body.error));
          self.pending.push(contenttype.uid);
        })
      },{
        concurrency: 1
      }).then(function () {
        return resolve();
      }).catch(function (error) {
        return reject();
        // console.log("errrorMapper", error);
      })
    }) 
  },
  pendingContentTypes: function() {
    var self = this;
    return new Promise(function (resolve, reject) {
      return Promise.map(self.pending, function (contenttype) {
        //var contenttypeUid = contenttype.uid;
        self.requestOptions['url'] = config.host + config.apis.content_types+contenttype
        self.requestOptions['method'] = 'DELETE'
        return request(self.requestOptions).then(function (response_data) {
          if(response_data.statusCode == 200) {
            log.success(contenttype+' '+ 'contenttype deleted successfully');  
          }         
        }).catch(function (error) {
          log.error(error);
        })
      },{
        concurrency: 1
      }).then(function () {
        return resolve();
      }).catch(function (error) {
        return reject(error);
        // console.log("errrorMapper", error);
      })
    }); 
  }
};

module.exports = new DeleteContentTypes();
