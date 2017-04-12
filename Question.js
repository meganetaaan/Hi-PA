var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var questionSchema = new Schema({
    slideNumber : Number,
    question : { type : String, required : true },
    nickname : String,
    password : { type : String, required : true },
    like : { type : Number, default : 0 },
    time : { type : Date, default : Date.now }
});
var Question = mongoose.model('Question', questionSchema);

module.exports = Question;
