var express = require('express');
var Question = require('../model/Question');
var router = express.Router();

function _broadcastAdd(req, res, next) {
    let q = res.locals.q;
    req.io.emit('ADD_QUESTION', q);
    next();
}

function _broadcastDelete(req, res, next) {
    let id = res.locals.id;
    req.io.emit('DELETE_QUESTION', {id:id});
    next();
}

function _broadcastUpdate(req, res, next) {
    let q = res.locals.q;
    req.io.emit('UPDATE_QUESTION', {id:q.id, like_cnt:q.like});
    next();
}

router.post('/', _broadcastAdd);
router.delete('/:id', _broadcastDelete);
router.put('/like/:id', _broadcastUpdate);
router.put('/dislike/:id', _broadcastUpdate);

module.exports = router;
