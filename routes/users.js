var express = require('express');
var router = express.Router();
var User = require('../models/User');
var util = require('../util');
var multer = require('multer');
var File2 = require('../models/File2');
var upload = multer({ dest: 'uploadedFiles2/' });

// New
router.get('/new', function(req, res){
  var user = req.flash('user')[0] || {};
  var errors = req.flash('errors')[0] || {};
  res.render('users/new', { user:user, errors:errors });
});

// create
router.post('/', upload.single('card'),async function(req, res){
  console.log('난 req body:', req.body); //출력 잘됨
 
  console.log('난 req.body.user1', req.body.user1  ); //출력안됨
  var card = req.file ? await File2.createNewInstance(req.file,req.body.user):undefined;
       req.body.card = card._id;
       console.log('난 card:', card);
      console.log('난 card._id',card._id);
    User.create(req.body, function(err, user){   
    if(err){
      console.log('나 req.body', req.body);
      req.flash('user', req.body);
      req.flash('errors', util.parseError(err));
      return res.redirect('/users/new');
    }   
    console.log('난 user._id:', user._id);      
    card.user= user._id;
    user.card= card._id;
    console.log('난 card.user',card.user);
    console.log('난 user.card:', user.card); //출력 안됨
    res.redirect('/');
  });
});

// show
router.get('/:username', util.isLoggedin, checkPermission, function(req, res){
  User.findOne({username:req.params.username}, function(err, user){
    if(err) return res.json(err);
    res.render('users/show', {user:user});
  });
});

// edit
router.get('/:username/edit', util.isLoggedin, checkPermission, function(req, res){
  var user = req.flash('user')[0];
  var errors = req.flash('errors')[0] || {};
  if(!user){
    User.findOne({username:req.params.username}, function(err, user){
      if(err) return res.json(err);
      res.render('users/edit', { username:req.params.username, user:user, errors:errors });
    });
  }
  else {
    res.render('users/edit', { username:req.params.username, user:user, errors:errors });
  }
});

// update
router.put('/:username', util.isLoggedin, checkPermission, function(req, res, next){
  User.findOne({username:req.params.username})
    .select('password')
    .exec(function(err, user){
      if(err) return res.json(err);

      // update user object
      user.originalPassword = user.password;
      user.password = req.body.newPassword? req.body.newPassword : user.password;
      for(var p in req.body){
        user[p] = req.body[p];
      }

      // save updated user
      user.save(function(err, user){
        if(err){
          req.flash('user', req.body);
          req.flash('errors', util.parseError(err));
          return res.redirect('/users/'+req.params.username+'/edit');
        }
        res.redirect('/users/'+user.username);
      });
  });
});

module.exports = router;

// private functions
function checkPermission(req, res, next){
  User.findOne({username:req.params.username}, function(err, user){
    if(err) return res.json(err);
    if(user.id != req.user.id) return util.noPermission(req, res);

    next();
  });
}
