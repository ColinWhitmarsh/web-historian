// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

//For automatic downloading, add the line below to local crontab
// * * * * * /usr/local/bin/node /absolute/path/to/htmlfetcher.js



var helper = require('../helpers/archive-helpers');
var urlsToDownload = [];
var callCount = 0;

helper.readListOfUrls(function(Urls) {
  for(var i = 0; i<Urls.length; i++) {
    helper.isUrlArchived(Urls[i], function(err, isArchvied, Url){
      callCount++;
      if(!isArchvied) {
        urlsToDownload.push(Url);
      }
      if (callCount === Urls.length) {
        helper.downloadUrls(urlsToDownload);
      }
    });
  }
});

