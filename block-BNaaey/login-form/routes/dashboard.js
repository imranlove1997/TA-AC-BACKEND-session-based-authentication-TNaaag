var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    console.log(req.session);
    res.render('dashboard');
});

module.exports = router;