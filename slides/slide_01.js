var fs = require('fs');
var path = require('path');
var jsonPath = path.join(__dirname, 'slide_01.html');
module.exports = {
    slideName : "slide_1",
    content : fs.readFileSync(jsonPath,'utf8'),
    slideNo : 5,
    duration : 300
}
