var express = require('express');
var sassMiddleware = require('node-sass-middleware')
var bodyParser = require('body-parser');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server)

var api = {}; api.question = require('./api/question');
var socket = {}; socket.question = require('./socket/question');

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended:true}));

/*io.on('connect', (socket) => {
    console.log('socket connected');
});*/
var questionIO = io.of('/socket/question');
app.use('/api/question', (req, res, next) => {
    req.io = questionIO;
    next();
});
//quiestionIO.on
app.use('/api/question', api.question);
app.use('/api/question', socket.question);

app.use('/public/stylesheets',
    sassMiddleware({
        src: __dirname + '/public/stylesheets/sass', //where the sass files are
        dest: __dirname + '/public/stylesheets', //where css should go
        debug: true // obvious
    })
);
app.use('/public', express.static('public'));
app.use('/', express.static('view'));

var db = require('./db');
db.connect('test');
var port = 8000;
server.listen(port, () => {
    console.log(`listening on port ${port}`);
});
module.exports = app;
