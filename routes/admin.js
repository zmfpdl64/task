var express = require('express');
var router = express.Router();
var User = require('../models/User');
var File2 = require('../models/File2');


router.get('/', function(req, res) {
  Promise.all([
    User.find({Value:'0'}).populate({path:'card', model: File2})

  ])  
    .then(([contacts]) => {
        res.render('home/admin', {contacts:contacts});

    }) 
    .catch((err) => {
        return res.json(err);
    })   
    });

router.get('/')
module.exports = router;