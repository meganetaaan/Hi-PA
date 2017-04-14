var mongoose = require('mongoose');
let test = 'mongodb://localhost/test';
let prod = 'mongodb://localhost/Hi-PA';
function connect(option) {
    if (option === 'test')
        mongoose.connect(test);
    else if (option === 'prod')
        mongoose.connect(prod);
}
module.exports = {mongoose : mongoose, connect : connect};
