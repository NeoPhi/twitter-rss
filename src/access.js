'use strict';

var fs = require('fs');
var debug = require('debug')('access');
var twitter = require('./lib/twitter');
var config = require('../config');

if (config.accessToken) {
  throw new Error('Already have access token');
} else {
  twitter.accessToken(config.apiKey, config.apiSecret, function(err, accessToken) {
    if (err) {
      throw err;
    }
    debug('Success');
    config.accessToken = accessToken;
    fs.writeFileSync('config.json', JSON.stringify(config, null, '  '));
  });
}
