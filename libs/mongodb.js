var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test', {
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }
});

module.exports = mongoose;