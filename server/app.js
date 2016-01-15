var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
module.exports = app;

// The path of our public directory. ([ROOT]/public)
var publicPath = path.join(__dirname, '../public');

// The path of our index.html file. ([ROOT]/index.html)
var indexHtmlPath = path.join(__dirname, '../index.html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(publicPath));

// The home page, which links to the main html file
app.get('/', function (req, res) {
    res.sendFile(indexHtmlPath);
});

// The router to get data of popular events from Eventbrite API, with specified page number
app.get('/data/:id', function (req, res){
    request({
      url: 'https://www.eventbriteapi.com/v3/events/search/?popular=on&token=NDLRP3PVI4DELH76QP2Y&page='+req.params.id,
      method: 'GET'
    },
    function(err, response, body) {
      if(err || response.statusCode != 200) {
        callback('Unable to authenticate with Eventbrite.');
        return;
      } else {
        var js = JSON.parse(body);
        res.send(js.events);
      }
  });
})



