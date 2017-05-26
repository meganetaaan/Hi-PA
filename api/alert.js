var express = require('express');
var router = express.Router();
var alert = require('../model/alert');

function _getAlert(req, res, next){
    res.json({questionID : null, tooltip: null});
}

router.get('/', _getAlert);
module.exports = router;
