// var ip = process.env.
var port = process.env.PORT || 8000;
var express = require('express');

var routes = require('./routes');

var app = express()

app.use('/',routes);
app.use(express.static('public'));

var server = app.listen(port, function(){
    console.log('Server running and listening on port %s', port);
});