var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, content){
    callback(content.split("\n"));
  });
};

exports.isUrlInList = function(Url, callback) {
  exports.readListOfUrls(function(urls){
    isInList = false;
    for(var i = 0; i<urls.length; i++) {
      if (urls[i]===Url) {
        isInList = true;
        break;
      }
    }
    callback(null, isInList);
  });
};

exports.addUrlToList = function(Url, callback) {
  fs.appendFile(exports.paths.list, Url, 'utf8', function(err) {
    if(err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

exports.isUrlArchived = function(Url, callback) {
  //Get the list of sites in exports.paths.archivedSites
  fs.readdir(exports.paths.archivedSites, function(err, results) {
    if(err) {
      console.log('Error:', err);
      return callback(err, null);
    } else {
      var isSiteArchived = false;

      for(var i = 0; i<results.length; i++) {
        if (results[i] === Url) {
          isSiteArchived = true;
        }
      }
      return callback(null, isSiteArchived);
    }
  });
};

exports.downloadUrls = function(Urls) {
  for (var i = 0; i < Urls.length; i++) {
    // perform GET request on each url
    // write response to a text file
    request("http://" + Urls[i]).pipe(fs.createWriteStream(path.join(exports.paths.archivedSites, Urls[i])));




  }
};


