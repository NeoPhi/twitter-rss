'use strict';

var fs = require('fs');
var twitter = require('./lib/twitter');
var config = require('../config');

if (config.accessToken) {
  console.log('Already have access token');
} else {
  twitter.accessToken(config.apiKey, config.apiSecret, function(err, accessToken) {
    if (err) {
      throw err;
    }
    console.log('Success');
    config.accessToken = accessToken;
    fs.writeFileSync('config.json', JSON.stringify(config, null, '  '));
  });
}
