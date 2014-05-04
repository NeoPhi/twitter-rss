'use strict';

var fs = require('fs');
var async = require('async');
var twitter = require('./lib/twitter');
var config = require('../config');

if (!config.accessToken) {
  console.log('No access token');
} else {
  async.eachSeries(config.screenNames, function(screenName, callback) {
    twitter.userTimeline(config.accessToken, screenName, function(err, timeline) {
      if (err) {
        return callback(err);
      }
      console.log('Success ' + screenName);
      fs.writeFileSync('json/timelines/' + screenName + '.json', JSON.stringify(timeline, null, '  '));
      callback();
    });
  }, function(err) {
    if (err) {
      throw err;
    }
    console.log('Success');
  });
}
