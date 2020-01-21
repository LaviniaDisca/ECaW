let express = require('express');
let router = express.Router();
let mongoDB = require('mongodb').MongoClient;
const databaseURL = require('../app');
let jwtChecker = require('../jwt');

//all projects owned by the user provided in the JWT
router.get('/', jwtChecker.verifyToken, jwtChecker.validateToken, function (req, res, next) {
    mongoDB.connect(databaseURL.databaseURL, function (err, client) {
        if (err) throw err;
        let db = client.db('ecaw');

        db.collection('projects').find({username: req.decoded.username}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
        })
    });
});

//returns the project with id projectId (no token needed here because the cards can be shared without the need of authentication)
router.get('/:projectId', function (req, res) {
    mongoDB.connect(databaseURL.databaseURL, function (err, client) {
        if (err) throw err;
        let db = client.db('ecaw');

        db.collection('projects').findOne({
            _id: parseInt(req.params.projectId)
        }, function (err, result) {
            if (err) throw err;
            if (result) {
                res.send(result);
            } else {
                res.status(404).send({
                   success:false,
                   message:"Project not found"
                });
            }
        })
    });
});

//updates the project
router.post('/:projectId', jwtChecker.verifyToken, jwtChecker.validateToken, function (req, res) {
    mongoDB.connect(databaseURL.databaseURL, function (err, client) {
        if (err) throw err;
        let db = client.db('ecaw');

        db.collection('projects').findOne({
            _id: parseInt(req.params.projectId)
        }, function (err, result) {
            if (err) throw err;
            if (result) {
                if (result.username !== req.decoded.username) {
                    res.status(401).send({
                        success: false,
                        message: "You do not own this project"
                    })
                } else {
                    //if the project exists, overwrite it
                    db.collection('projects').replaceOne(
                        {_id: parseInt(req.body._id)},
                        req.body, {upsert: true}
                    );
                    res.send({
                        success: true,
                        message: "Card saved"
                    })
                }
            } else {
                //if it doesn't add it to the database
                db.collection('projects').insert(req.body, function (err) {
                    if (err) throw err;
                    else console.log("updated");
                });
                res.send({
                    success: true,
                    message: "Card saved"
                })
            }
        });
    });
});

module.exports = router;
