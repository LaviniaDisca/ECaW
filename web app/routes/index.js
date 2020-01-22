let express = require('express');
let router = express.Router();
const url = require('url');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('login');
});

router.get('/index', function (req, res) {
    res.render('index');
});

router.get('/register', function (req, res) {
    res.render('register');
});

router.get('/home', function (req, res) {
    res.render('home');
});

module.exports = router;
