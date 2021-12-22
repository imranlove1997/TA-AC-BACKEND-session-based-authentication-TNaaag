var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();

app.use(cookieParser());


app.get('/', (req, res) => {
    res.cookie('name', 'altcampus').send('Cookie set');
    console.log(req.cookies);
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});