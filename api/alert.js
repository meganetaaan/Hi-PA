var express = require('express');
var router = express.Router();
var alert = require('../model/alert');
var alertsocket = require('../socket/alert');

function _getAlert(req, res, next){
    var senddata;
    alert.getQuestionAlert(function (result, leftTime) {
        if (result !== null) {
            senddata = {questionID : result._id, tooltip : null, leftTime, question : result};
            res.json(senddata);
        } else {
            senddata = {questionID : null, tooltip : alert.getTooltipAlert(), leftTime, question : null}
            res.json(senddata);
        }
        alertsocket.presenter.emit('UrgentAlert', senddata);
        console.log(senddata);
    });
    //next();
}

router.get('/', _getAlert);
module.exports = router;
