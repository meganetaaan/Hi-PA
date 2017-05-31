var time = require('./time');
var Question = require('./Question');
var io = require('../socket/io').io();
var slideCtrl = require('./slide');
var slide = slideCtrl.getSlide('slide_01');
var tooltip = require('../socket/tooltip');
var rawtime = require('time');

var alert = {};
alert.doneQuestionIDs = [];
alert.doneTerms = [];
alert.lastTimeAlert = 0;

function getClientNo() {
    return io.engine.clientsCount;
}

function getTimeAlert() {
    var slideNo = slide.state.indexh;
    var slideLeftTime = time.slideTime * (slideNo + 1) - time.getTime();
    if (slideLeftTime <= 0 && rawtime.time() - alert.lastTimeAlert >= 20) {
        lastTimeAlert = rawtime.time();
        return true;
    } else {
        return false;
    }
}

function getQuestionAlert(callback){
    var slideNo = slide.state.indexh;
    Question.find({slideNumber:slideNo}, function(er, res){
        var questionFactor = res.reduce(function (prevVal, elem){return prevVal + elem}, 0);
        var slideLeftTime = time.slideTime * (slideNo + 1) - time.getTime();
        if (questionFactor >= getClientNo()/10000000000) {
            res.sort();
            var i = res.length - 1;
            while (alert.doneQuestionIDs.includes(list[i]._id) && i >= 0) {
                i--;
            }
            alert.doneQuestionIDs.push(list[i]._id);
            callback(list[i]._id, slideLeftTime);
        } else {
            callback(null, slideLeftTime);
        }
    });
}

function getTooltipAlert(){
    var urgents = Object.keys(tooltip.term).filter(function (el, i, a) {
        return tooltip.term[el] >= 0.0 * getClientNo() && !alert.doneTerms.includes(el);
    });
    if (urgents.length > 0) {
        urgents.sort(function (a, b) {
            if (tooltip.term[a] > tooltip.term[b]) {
                return 1;
            } else if (tooltip.term[a] < tooltip.term[b]) {
                return -1;
            } else {
                return 0;
            }
        });
        var urgent = urgents.pop();
        alert.doneTerms.push(urgent);
        return urgent;
    } else {
        return null;
    }
}

module.exports = {
    getTimeAlert,
    getQuestionAlert,
    getTooltipAlert
};
