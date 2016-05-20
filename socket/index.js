//Dependencies
var connect = require('connect');
var mongoose = require('../libs/mongodb');
var async = require('async');
var cookieParser = require('cookie-parser');
var cookie = require('cookie');
var sessionStore = require('../libs/sessionStore');
var HttpError = require('../error').HttpError;
var User = require('../models/user').User;

function LoadSession(sid, callback) {
    sessionStore.load(sid, function (err, session) {
        if(arguments.length == 0){
            return callback(null, null);
        }else{
            return callback(null, session);
        }
    })
}

function LoadUser(session, callback) {
    if(!session.user){
        return callback(null, null);
    }

    User.findById(session.user, function (err, user) {
        if (err) return callback(err);

        if(!user){
            return callback(null, null)
        }

        callback(null, user);
    })
}

module.exports = function (server) {
    var io = require('socket.io')(server);

    io.use(function(socket, next) {
        async.waterfall([
            function (callback) {
                socket.request.cookies = cookie.parse(socket.request.headers.cookie || '');
                var sidCookie = socket.request.cookies['sid'];
                var sid = cookieParser.signedCookie(sidCookie, 'KillersIsJim');

                LoadSession(sid, callback);
            },
            function (session, callback) {
                if(!session){
                    callback(new HttpError(401, 'No session'))
                }

                socket.request.session = session;
                LoadUser(session, callback);
            },
            function (user, callback) {
                if(!user){
                    callback(new HttpError(403, 'Anonymous session may not connect'))
                }

                socket.request.user = user;
                callback(null);
            }
        ], function (err) {
            if(!err){
                 next(null, null);
            }

            if(err instanceof HttpError){
                next(err);
            }

            next();
        });
    });


    io.on('connection', function (socket) {
        var username = socket.request.user.get('username');

        socket.broadcast.emit('join', username);

        socket.on('message', function (message, callback) {
            socket.broadcast.emit('message', username, message);
            callback && callback();
        });

        socket.on('disconnect', function () {
            socket.broadcast.emit('leave', username);
        })
    });


    io.on('session:reload', function (sid) {
        var clients = io.sockets.clients();
        
        clients.forEach(function (client) {
            if(client.request.session.id != sid) return;
            LoadSession(sid, function (err, session) {
                if(err){
                    client.emit('error', 'server error');
                    client.disconnect();
                    return;
                }

                if(!session){
                    client.emit('error', 'handshake unauthorized');
                    client.disconnect();
                    return;
                }

                client.request.session = session;
            })
        })
    });


    return io
};