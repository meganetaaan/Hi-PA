var express = require('express');
var Question = require('../model/Question');
var router = express.Router();

function _getQuestion(req, res) {
    Question.find({}, function (err, results) {
        if (err)
            throw err;
        res.json(results);
    });
}

function _postQuestion(req, res) {
    var q = new Question(req.body);
    q.save((err, book) => {
        if (err)
            throw err;
        res.sendStatus(200);
    });
}

function _deleteQuestion(req, res, next) {
}

function _likeQuestion(req, res, next) {
}

router.get('/', _getQuestion);
router.post('/', _postQuestion);
router.delete('/', _deleteQuestion);
router.post('/like', _likeQuestion);

module.exports = router;
