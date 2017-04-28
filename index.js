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
app.use(bodyParser.urlencoded({extended:true});
app.use('/api/question', question);
app.use('/public', express.static('public'));
app.use('/', express.static('view'));

var server = app.listen(8000, function (){});
