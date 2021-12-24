var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.userId) {
    res.redirect('/users/register')
  }
  res.render('index');  
});

module.exports = router;