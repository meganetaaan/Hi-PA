var express = require('express');
var router = express.Router();
var alert = require('../model/alert');

function _getAlert(req, res, next){
    var senddata;
    console.log('alert called');
    alert.getQuestionAlert(function (result, leftTime) {
        if (result !== null) {
            senddata = {questionID : result, tooltip : null, leftTime };
            res.json(senddata);
        } else {
            senddata = {questionID : null, tooltip : alert.getTooltipAlert(), leftTime}
            res.json(senddata);
        }
        console.log(senddata);
    });
    //next();
}

router.get('/', _getAlert);
module.exports = router;
