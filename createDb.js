//Dependencies
var mongoose = require('./libs/mongodb');
var async = require('async');

async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers
], function (err) {
    console.log('Error', err);
    console.log('All process is done!');
    mongoose.disconnect();
});

function open(callback) {
    mongoose.connection.on('open', callback);
    console.log('DB connecting ...');
}

function dropDatabase(callback) {
    var db = mongoose.connection.db;
    console.log('DB connected ...');
    db.dropDatabase(callback);
}

function requireModels(callback) {
    require('./models/user');
    async.each(Object.keys(mongoose.models), function (modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createUsers(callback){
    var users = [
        {username: 'Petya', password: 'supervasya'},
        {username: 'Vasya', password: '123'},
        {username: 'Admin', password: 'Admin'}
    ];

    console.log('DB dropped ...');
    async.each(users, function (item, callback) {
        new mongoose.models.User(item).save(callback);
    }, callback)
}