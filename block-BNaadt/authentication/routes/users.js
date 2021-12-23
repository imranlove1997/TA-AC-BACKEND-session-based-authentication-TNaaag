var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.get('/register', (req, res) => {
  var exist = req.flash('exist')[0];
  var min = req.flash('min')[0];
  res.render('register', { exist, min });
});

router.post('/register', (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if(err) return next(err);
    if(user) {
      req.flash('exist', 'User already Exist');
      return res.redirect('/users/register');
    }
    if(req.body.password.length < 4) {
      req.flash('min', 'Password more than 4 characters');
      return res.redirect('/users/register');
    }
    User.create(req.body, (err, userCreated) => {
      if(err) return next(err);
      res.redirect('/users/login');
    });
  });
});
  

router.get('/login', (req, res) => {
  var error = req.flash('error')[0];
  var error1 = req.flash('error1')[0];
  var error2 = req.flash('error2')[0];
  res.render('login', { error, error1, error2 });
})

router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if(!email || !password) {
    req.flash('error', 'Email/Password required');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if(err) return next(err);
    if(!user) {
      req.flash('error1', 'Email is not registered');
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      if(!result) {
        req.flash('error2', 'Password is incorrect');
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      req.flash('welcome', 'Hello User');
      res.redirect('/dashboard');
    })
  })
})

module.exports = router;
