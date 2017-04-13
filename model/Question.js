var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var assert = require('assert');
var SALT_WORK_FACTOR = 10;
var Schema = mongoose.Schema;

// Schema
var questionSchema = new Schema({
    slideNumber : Number,
    question : { type : String, required : true },
    nickname : String,
    password : { type : String, required : true },
    like : { type : Number, default : 0 },
    time : { type : Date, default : Date.now }
});

// hash password when save
questionSchema.pre('save', function (next) {
    var question = this;
    assert((typeof this.password) !== 'undefined');
    // generate hash
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err)
            return next(err);
        bcrypt.hash(question.password, salt, function (err, hash) {
            if (err)
                return next(err);
            question.password = hash;
            next();
        });
    });
});

// comaprison with salt
questionSchema.methods.comparePassword = function (inputPassword, callback) {
    bcrypt.compare(inputPassword, this.password, (err, match) => {
        if (err)
            return callback(err);
        callback(null, match);
    });
}
var Question = mongoose.model('Question', questionSchema);

module.exports = Question;
