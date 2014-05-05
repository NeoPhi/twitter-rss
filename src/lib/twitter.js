'use strict';

// https://dev.twitter.com/docs/api/1.1

var request = require('request');

var OAUTH2_TOKEN_URL = 'https://api.twitter.com/oauth2/token';
var USER_TIMELINE_URL = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
var USERS_LOOKUP_URL = 'https://api.twitter.com/1.1/users/lookup.json';

function usersLookup(accessToken, screenNames, callback) {
  request.post(USERS_LOOKUP_URL, {
    'form': {
      'screen_name': screenNames.join(',')
    },
    'headers': {
      'Authorization': 'Bearer ' + accessToken
    }
  }, function(err, httpResponse, body) {
    if (err) {
      return callback(err);
    }
    if (httpResponse.statusCode !== 200) {
      return callback(new Error('Wanted HTTP response code 200 got ' + httpResponse.statusCode));
    }
    try {
      var json = JSON.parse(body);
      callback(null, json);
    } catch(err) {
      return callback(err);
    }
  });
}

function userTimeline(accessToken, screenName, callback) {
  request.get(USER_TIMELINE_URL, {
    'qs': {
      'screen_name': screenName,
      'count': 100
    },
    'headers': {
      'Authorization': 'Bearer ' + accessToken
    }
  }, function(err, httpResponse, body) {
    if (err) {
      return callback(err);
    }
    if (httpResponse.statusCode !== 200) {
      return callback(new Error('Wanted HTTP response code 200 got ' + httpResponse.statusCode));
    }
    try {
      var json = JSON.parse(body);
      callback(null, json);
    } catch(err) {
      return callback(err);
    }
  });
}

function accessToken(apiKey, apiSecret, callback) {
  request.post(OAUTH2_TOKEN_URL, {
    'auth': {
      'user': apiKey,
      'pass': apiSecret,
      'sendImmediately': true
    },
    'form': {
      'grant_type': 'client_credentials'
    }
  }, function(err, httpResponse, body) {
    if (err) {
      return callback(err);
    }
    if (httpResponse.statusCode !== 200) {
      return callback(new Error('Wanted HTTP response code 200 got ' + httpResponse.statusCode));
    }
    try {
      var json = JSON.parse(body);
      if (json.token_type !== 'bearer') {
        return callback(new Error('Wanted token_type of bearer got ' + json.token_type));
      }
      callback(null, json.access_token);
    } catch(err) {
      return callback(err);
    }
  });
}

module.exports.accessToken = accessToken;
module.exports.userTimeline = userTimeline;
module.exports.usersLookup = usersLookup;
