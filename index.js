var express = require('express');
var db = require('./db');
db.connect('test');
var mongoose = db.mongoose
var url = db.test;
var app = express();
var bodyParser = require('body-parser');
var question = require('./api/question');

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use('/api/question', question);

var server = app.listen(8000, function (){});
