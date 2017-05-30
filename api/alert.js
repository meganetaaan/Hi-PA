var express = require('express');
var router = express.Router();
var alert = require('../model/alert');

function _getAlert(req, res, next){
    alert.getQuestionAlert(function (result, leftTime) {
        if (result !== null) {
            res.json({questionID : result, tooltip : null, leftTime });
        } else {
            res.json({questionID : null, tooltip : alert.getTooltipAlert(), leftTime});
        }
    });
}

router.get('/', _getAlert);
module.exports = router;
