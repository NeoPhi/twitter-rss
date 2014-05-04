'use strict';

var fs = require('fs');
var twitter = require('./lib/twitter');
var config = require('../config');

if (!config.accessToken) {
  console.log('No access token');
} else {
  twitter.usersLookup(config.accessToken, config.screenNames, function(err, users) {
    if (err) {
      throw err;
    }
    console.log('Success');
    fs.writeFileSync('json/users.json', JSON.stringify(users, null, '  '));
  });
}
