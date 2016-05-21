exports.get = function (req, res, next) {
    var io = req.app.get('io'),
        sid = req.session.id,
        userRoom = req.user._id,
        connectedSockets = io.of('/').in(userRoom).connected;

    req.session.destroy(function (err) {
        Object.keys(connectedSockets).forEach(function (socketId) {
            var socket = connectedSockets[socketId];
            if (socket.handshake.session.id == sid) {
                socket.broadcast.emit('leave', req.user);
                socket.emit('logout');
                socket.disconnect();
            }
        });

        if (err) return next(err);
        res.redirect('/');
    });
};