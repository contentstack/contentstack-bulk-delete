/*!
 * Contentstack Bulk Delete
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */

const chalk = require('chalk');
const Promise = require('bluebird');
const _ = require('lodash');

const app = require('../../app')
const request = require('../util/request');
const log = require('../util/log');

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
      return new Promise(function (resolve, reject) {
        if(config.assetsdelete === true) {
        self.getAllAssets().then(function() {
          //log.success("All Assets deleted successfully")
          resolve();
        }).catch(function(error){
          log.error(error)
          reject();
        })
      } else {
        console.log("Please set the deleteAssets as true in config file")
        reject();
      }
      });
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
    var parent_assets =[];
    var new_assets_array=[];
    return new Promise(function (resolve, reject) {
     
      for(var i=0; i<assets.length; i++) {
          if(assets[i].parent_uid && assets[i].parent_uid != null && assets[i].parent_uid != undefined) {
          if(parent_assets.indexOf(assets[i].parent_uid) !== -1) {
            new_assets_array.push(assets[i].uid);

          } else {
            parent_assets.push(assets[i].parent_uid);
            new_assets_array.push(assets[i].uid); 
          }
    } else {
      console.log("Not having parent_uid");
    }
  }

      for(var j=0; j<new_assets_array.length; j++) {
          var result = _.findIndex(assets, function(o) {
                  return o.uid == new_assets_array[j]; 
            });
            assets.splice(result, 1);
      }

      var other = _.concat(assets, parent_assets);
      return Promise.map(other, function (asset) {
        if(asset.uid) {
          self.requestOptions['url'] = config.host + config.apis.assets+asset.uid
        } else {
          console.log(asset)
          self.requestOptions['url'] = config.host + config.apis.assets+'folders/'+asset
        }
        self.requestOptions['method'] = 'DELETE'
        return request(self.requestOptions).then(function (response_data) {
          if(response_data.statusCode == 200) {
            if(asset.title) {
              log.success(asset.title+' '+ 'asset deleted successfully');   
            } else {
              log.success("Folder"+' '+ 'deleted successfully');   
            }
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
      })
    }) 
  }
};

module.exports = new DeleteAseets();
