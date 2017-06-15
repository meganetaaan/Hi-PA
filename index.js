var express = require('express');
var sassMiddleware = require('node-sass-middleware')
var bodyParser = require('body-parser');

var app = express();
var server;
//https
if (process.env.HTTPS == 'true') {
    var fs = require('fs');
    var options = {
        key : fs.readFileSync('/etc/letsencrypt/live/hoonga.kr/privkey.pem', {flag : 'r'}),
        cert : fs.readFileSync('/etc/letsencrypt/live/hoonga.kr/cert.pem', {flag : 'r'})
    }
    server = require('https').Server(options, app);
}
else
    server = require('http').Server(app);
var io = require('./socket/io').init(server)

var api = {}; api.question = require('./api/question'); api.script = require('./api/script'); api.time = require('./api/time'); api.alert = require('./api/alert');
var socket = {}; socket.question = require('./socket/question');
var script = require('./socket/script');
var slide = require('./socket/slide');
var feedback = require('./socket/feedback');
var time = require('./socket/time');

app.set('view engine', 'ejs');
app.set('views', 'view');
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/api/question', api.question);
app.use('/api/question', socket.question);
app.use('/api/script', api.script);
app.use('/api/time', api.time);
app.use('/api/alert', api.alert);

app.use('/public/stylesheets',
    sassMiddleware({
        src: __dirname + '/public/stylesheets/sass', //where the sass files are
        dest: __dirname + '/public/stylesheets', //where css should go
        debug: true // obvious
    })
);

// for custom reveal js theme (bulma.scss)
app.use('/public/lib/reveal/css/theme',
    sassMiddleware({
        src: __dirname + '/public/lib/reveal/css/theme/source',
        dest: __dirname + '/public/lib/reveal/css/theme',
        debug: true
    })
)

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

app.get('/slideshow', (req, res) => {
    res.render('slideshow');
})

var db = require('./db');
db.conn();
var port = 8000;
server.listen(port, () => {
    console.log(`listening on port ${port}`);
});
module.exports = app;
