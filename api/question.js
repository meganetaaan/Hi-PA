var express = require('express');
var Question = require('../model/Question');
var router = express.Router();

function _getQuestion(req, res) {
    Question.find({}, function (err, results) {
        res.json(results);
    });
}

function _postQuestion(req, res) {
    var q = new Question(req.body);
    q.save((err, book) => {
        if (err) {
            switch (err.name) {
                case 'Validation Error':
                    res.sendStatus(400);
                    break;
                default:
                    res.sendStatus(400);
                    break;
            }
        }
        else {
            res.sendStatus(200);
        }
    });
}

function _deleteQuestion(req, res) {
}

function _likeQuestion(req, res) {
}

router.get('/', _getQuestion);
router.post('/', _postQuestion);
router.delete('/', _deleteQuestion);
router.post('/like', _likeQuestion);

module.exports = router;
