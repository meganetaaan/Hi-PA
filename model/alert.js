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
alert.threshold = {
    question : 1,
    tooltip :1,
    time : 60
}
alert.slide = slide;

function getClientNo() {
    return io.engine.clientsCount;
}

function getTimeAlert() {
    var slideNo = slide.state.indexh;
    var slideLeftTime = time.slideTime * (slideNo + 1) - time.getTime();
    if (slideLeftTime <= 0 && rawtime.time() - alert.lastTimeAlert >= alert.threshold.time) {
        alert.lastTimeAlert = rawtime.time();
        return true;
    } else {
        return false;
    }
}

function getQuestionAlert(callback){
    var slideNo = slide.state.indexh;
    Question.find({slideNumber:slideNo}, function(er, res){
        var questionFactor = res.filter(function (el, i, a){return !alert.doneQuestionIDs.includes(''+el._id);}).reduce(function (prevVal, elem){return prevVal + elem.like}, 0);
        console.log(questionFactor);
        var slideLeftTime = time.slideTime * (slideNo + 1) - time.getTime();
        if (questionFactor >= alert.threshold.question) {//getClientNo()/3) {
            res.sort();
            var i = res.length - 1;
            while (i >= 0 && alert.doneQuestionIDs.includes(''+res[i]._id)) {
                i--;
            }
            alert.doneQuestionIDs.push(''+res[i]._id);
            console.log(alert.doneQuestionIDs);
            callback(res[i], slideLeftTime);
        } else {
            callback(null, slideLeftTime);
        }
    });
}

function getTooltipAlert(){
    var urgents = Object.keys(tooltip.term).filter(function (el, i, a) {
        return tooltip.term[el] >= alert.threshold.tooltip * getClientNo() && !alert.doneTerms.includes(el);
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
    alert,
    getTimeAlert,
    getQuestionAlert,
    getTooltipAlert
};
