'use strict';

var fs = require('fs');
var debug = require('debug')('users');
var twitter = require('./lib/twitter');
var config = require('../config');

if (!config.accessToken) {
  throw new Error('No access token');
} else {
  twitter.usersLookup(config.accessToken, config.screenNames, function(err, users) {
    if (err) {
      throw err;
    }
    debug('Success');
    fs.writeFileSync('json/users.json', JSON.stringify(users, null, '  '));
  });
}
