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

router.put('/:username', function(req,res) {  
  User.findOneAndUpdate({username:req.params.username}, req.body.Value, function(err, user) {
    if(err) return res.json(err);    
    console.log(req.body)
    console.log('난 권한값2:', user.Value);
    user.Value = req.body.value;
     console.log('난 권한값2:', user.Value);
     console.log('난 유저값:', user);
     
     user.save();
  });

  res.redirect('/admin')
 });
module.exports = router;