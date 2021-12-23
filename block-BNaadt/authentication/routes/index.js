var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/dashboard', (req, res, next) => {
  console.log(req.session);
  var welcome = req.flash('welcome');
  res.render('dashboard', { welcome });
});

module.exports = router;
