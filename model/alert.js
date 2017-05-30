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
    var timeFactor = (slide.slideNo - slide.state.indexh)*(time.duration - time.getTime()) / slide.slideNo / time.duration;
    if (timeFactor >= 1.4 && rawtime.time() - lastTimeAlert >= 20) {
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
        var slideLeftTime = time.getTime() - time.slideTime * slideNo;
        if (questionFactor >= getClientNo()/3 && slideLeftTime >= 60) {
            res.sort();
            var i = 0;
            while (alert.doneQuestionIDs.includes(list[i]._id)) {
                i++;
            }
            alert.doneQuestionIDs.push(list[i]._id);
            callback(list[i]._id);
        } else {
            callback(null);
        }
    });
}

function getTooltipAlert(){
    var urgents = Object.keys(tooltip.term).filter(function (el, i, a) {
        return tooltip.term[el] >= 0.2 * getClientNo() && !alert.doneTerms.includes(el);
    });
    alert.doneTerms.concat(urgents);
    return urgents.length > 0 ? urgents : null;
}

module.exports = {
    getTimeAlert,
    getQuestionAlert,
    getTooltipAlert
};
