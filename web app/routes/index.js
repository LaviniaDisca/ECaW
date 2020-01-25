let express = require('express');
let router = express.Router();

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

router.get('/projects', function (req, res) {
    res.render('projects');
});

router.get('/home', function (req, res) {
    res.render('home', {projectId: req.query.projectId});
});

module.exports = router;
