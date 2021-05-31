var express = require('express');
var router = express.Router();
var User = require('../models/User');
var util = require('../util');

router.get('/', function(req, res) {
    User.find({}, function(err, contacts) {
        if(err) return res.json(err);
        res.render('home/admin', {contacts:contacts});
    });
});

module.exports = router;