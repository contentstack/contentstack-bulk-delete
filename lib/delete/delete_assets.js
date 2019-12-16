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

var config = app.getConfig()


function DeleteAseets () {
  this.requestOptions = {
    url: config.host + config.apis.assets,
    headers: config.headers
  };
  this.pending = [];
}

DeleteAseets.prototype = {
  start: function () {
    log.success(chalk.blue('Starting Assets deletion'));
    var self = this;
    if(config.assetsdelete === true) {
      return new Promise(function (resolve, reject) {
        self.getAllAssets().then(function() {
          log.success("All Assets deleted successfully")
          resolve();
        }).catch(function(error){
          log.error(error)
          reject();
        })
      });
    }
  },

  getAllAssets: function() {
    var self = this;
    self.requestOptions['method'] = 'GET';

    return new Promise(function (resolve, reject) {
      return request(self.requestOptions).then(function (response) {
        // eslint-disable-next-line no-unused-vars
        var assets = response.body.assets;

        return self.deleteAllAssets(assets).then(function () {
          return resolve();
        }).catch(function (error) {
          // eslint-disable-next-line no-console
          return reject(error);
        });      
      }).catch(function (error) {
        return reject(error);
      });
    });



  },
  deleteAllAssets: function(assets) {
    var self = this;
    return new Promise(function (resolve, reject) {
      return Promise.map(assets, function (asset) {
        self.requestOptions['url'] = config.host + config.apis.assets+asset.uid

        if(asset.parent_uid && asset.parent_uid != '' && asset.parent_uid != undefined) {
          self.requestOptions['url'] = config.host + config.apis.assets+'folders/'+asset.parent_uid
        } else {
          self.requestOptions['url'] = config.host + config.apis.assets+asset.uid
        }
        self.requestOptions['method'] = 'DELETE'
        return request(self.requestOptions).then(function (response_data) {
          if(response_data.statusCode == 200) {
            log.success(asset.title+' '+ 'asset deleted successfully');   
          }         
        }).catch(function (error) {
          log.error(chalk.red(error));
          console.log(error.body.error_message)
          //self.pending.push(contenttype.uid);
        })
      },{
        concurrency: 2
      }).then(function () {
        return resolve();
      }).catch(function (error) {
        return reject(error);
        // console.log("errrorMapper", error);
      })
    }) 
  }
};

module.exports = new DeleteAseets();
