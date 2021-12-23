var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, userCreated) => {
    if(err) return next(err);
    res.redirect('/users/login');
  });
});

router.get('/login', (req, res) => {
  res.render('login');
})

router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if(!email || !password) {
    res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if(err) return next(err);
    if(!user) {
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      if(!result) {
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      res.redirect('/dashboard');
    })
  })
})

module.exports = router;
