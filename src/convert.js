'use strict';

var fs = require('fs');
var async = require('async');
var config = require('../config');
var RSS = require('rss');
var users = JSON.parse(fs.readFileSync('json/users.json'));
var userLookup = {};
users.forEach(function(user) {
  userLookup[user.screen_name] = user;
});

function convert(user, timeline, callback) {
  var feed = new RSS({
    'title': user.name + ' on Twitter',
    'description': user.description,
    'feed_url': 'http://www.neophi.com/home/danielr/rss/' + user.screen_name + '.xml',
    'site_url': 'https://twitter.com/' + user.screen_name,
    'author': user.screen_name
  });
  timeline.forEach(function(item) {
    var title = item.user.screen_name + ' on ' + item.created_at; 
    var text = item.text;
    if (item.retweeted_status) {
      text = item.retweeted_status.text;
      title += ' retweeted ' + item.retweeted_status.user.screen_name;
    } else {
      title += ' tweeted';
    }
    // TODO: make links clickable in text
    feed.item({
      'title': title,
      'description': text,
      'url': 'https://twitter.com/' + user.screen_name + '/status/' + item.id_str,
      'guid': user.id_str + ':' + item.id_str,
      'date': item.created_at
    });      
  });
  console.log('Success ' + user.screen_name);
  fs.writeFile('rss/' + user.screen_name + '.xml', feed.xml(), callback);
}

async.each(config.screenNames, function(screenName, callback) {
  fs.readFile('json/timelines/' + screenName + '.json', function(err, data) {
    if (err) {
      return callback(err);
    }
    var timeline = JSON.parse(data);
    convert(userLookup[screenName], timeline, callback);
  });
}, function(err) {
  if (err) {
    throw err;
  }
  console.log('Success');
});
