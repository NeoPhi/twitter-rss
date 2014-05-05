'use strict';

var fs = require('fs');
var async = require('async');
var debug = require('debug')('timelines');
var twitter = require('./lib/twitter');
var config = require('../config');

if (!config.accessToken) {
  throw new Error('No access token');
} else {
  async.eachSeries(config.screenNames, function(screenName, callback) {
    twitter.userTimeline(config.accessToken, screenName, function(err, timeline) {
      if (err) {
        return callback(err);
      }
      debug('Success ' + screenName);
      fs.writeFileSync('json/timelines/' + screenName + '.json', JSON.stringify(timeline, null, '  '));
      callback();
    });
  }, function(err) {
    if (err) {
      throw err;
    }
    debug('Success');
  });
}
