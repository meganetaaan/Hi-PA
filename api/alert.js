var express = require('express');
var router = express.Router();
var alert = require('../model/alert');

function _getAlert(req, res, next){
    alert.getQuestionAlert(function (result) {
        res.json({tooltip:alert.getTooltipAlert(),questionID:result});
    });
}

router.get('/', _getAlert);
module.exports = router;
