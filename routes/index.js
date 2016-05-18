var express = require('express');
var router = express.Router();
var mongoose = require('../libs/mongodb');
var User = require('../models/user').User;
var HttpError = require('../error').HttpError;

/* GET users listing. */
router.get('/users', function (req, res, next) {
  User.find({}, function (err, collection) {
    if(err) return next(err);
    res.json(collection);
  })
});

/* GET user by ID. */
router.get('/user/:id', function (req, res, next) {
  User.findById(req.params.id, function (err, user) {
    if(!user){
      next(new HttpError(404, "User not found"))
    }else{
      res.json(user);
    }
  })
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Express'});
});

module.exports = router;
