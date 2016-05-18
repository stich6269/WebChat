var express = require('express');
var router = express.Router();
var mongoose = require('../libs/mongodb');
var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var ObjectID = require('mongodb').ObjectID;

/* GET users listing. */
router.get('/', function (req, res, next) {
    User.find({}, function (err, collection) {
        if(err) return next(err);
        res.json(collection);
    })
});

/* GET user by ID. */
router.get('/:id', function (req, res, next) {
    try {
        var id = new ObjectID(req.params.id);
    } catch (e) {
        next(new HttpError(404, "Invalid userID"))
    }
    User.findById(id, function (err, user) {
        if(!user){
            next(new HttpError(404, "User not found"))
        }else{
            res.json(user);
        }
    })
});

module.exports = router;