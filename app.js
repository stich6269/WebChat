//Dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var HttpError = require('./error').HttpError;
var session = require('express-session');
var mongoose = require('./libs/mongodb');

//Created app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//User session
var sessionStore = require('./libs/sessionStore');

app.use(session({
    secret: 'KillersIsJim',
    name: 'sid',
    store:  sessionStore,
    proxy: false,
    resave: true,
    saveUninitialized: true
}));

//Custom middlevaresand router
app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));
require('./routes')(app);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Error handler
app.use(function (err, req, res, next) {
    console.log(err);

    if(typeof err.status == 'number'){
        err = new HttpError(err.status, err.message);
    }

    if(err instanceof HttpError){
        res.sendHttpError(err);
    }else{
        res.status(err.status || 500);
        res.json(err);
    }
});

module.exports = app;