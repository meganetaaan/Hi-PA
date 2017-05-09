var express = require('express');
var sassMiddleware = require('node-sass-middleware')
var bodyParser = require('body-parser');

var app = express();
var server;
//https
if (process.env.HTTPS == 'true') {
    var fs = require('fs');
    var options = {
        key : fs.readFileSync('/etc/letsencrypt/live/hoonga.kr/privkey.pem'),
        cert : fs.readFileSync('/etc/letsencrypt/live/hoonga.kr/cert.pem')
    }
    server = require('https').Server(options, app);
}
else
    server = require('http').Server(app);
var io = require('socket.io')(server)

var api = {}; api.question = require('./api/question');
var socket = {}; socket.question = require('./socket/question');
var script = require('./socket/script')(io);

app.set('view engine', 'ejs');
app.set('views', 'view');
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended:true}));

var questionIO = io.of('/socket/question');
app.use('/api/question', (req, res, next) => {
    req.io = questionIO;
    next();
});
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

app.get('/presenter', (req, res) => {
    console.log('presenter connected');
    res.render('index', {
        isPresenter: true,
    });
});

app.get('/audience', (req, res) => {
    res.render('index', {
        isPresenter: false,
    });
});

var db = require('./db');
db.connect('test');
var port = 8000;
server.listen(port, () => {
    console.log(`listening on port ${port}`);
});
module.exports = app;
