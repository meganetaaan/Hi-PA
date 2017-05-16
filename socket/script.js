var Script = require('../model/Script');

module.exports = function (io) {
    Script.remove({}).exec();
    var script = {};
    script.audience = io.of('/socket/script/audience');
    script.presenter = io.of('/socket/script/presenter');
    script.presenter.on('connection', (socket) => {
        console.log('connected');
        socket.on('ADD_SCRIPT', function f(data) {
            console.log(data);
            /*if (typeof f.cached == 'undefined') {
                f.cached = new Script(data);
            }
            if (f.cached.*/
            var s = new Script(data);
            s.save((err, res) => {
                if(err)
                    return;
                else
                    script.audience.emit('ADD_SCRIPT', data);
            });
        });
    });
    return script;
}
