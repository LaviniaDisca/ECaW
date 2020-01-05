let express = require('express');
let router = express.Router();
let mongoDB = require('mongodb').MongoClient;
const databaseURL = require('../app');

//all projects owned by user(username)
router.get('/:username', function (req, res, next) {
    console.log(databaseURL);
    mongoDB.connect(databaseURL.databaseURL, function (err, client) {
        if (err) throw err;
        let db = client.db('ecaw');

        db.collection('projects').find({username: req.params.username}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
        })

    });
});


//returns the project details for the user(username) with the specified id(projectId)
router.get('/:username/:projectId', function (req, res, next) {
    mongoDB.connect(databaseURL.databaseURL, function (err, client) {
        if (err) throw err;
        let db = client.db('ecaw');

        db.collection('projects').findOne({
            _id: parseInt(req.params.projectId),
            username: req.params.username
        }, function (err, result) {
            if (err) throw err;
            if (result) {
                res.send(result)
            } else {
                res.send("Empty")
            }
        })
    });
});

module.exports = router;
