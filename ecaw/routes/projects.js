let express = require('express');
let router = express.Router();
let mongoDB = require('mongodb').MongoClient;
const databaseURL = require('../app');


//returns the project details for the user(username) with the specified id(projectId)
router.get('/:projectId', function (req, res) {
    mongoDB.connect(databaseURL.databaseURL, function (err, client) {
        if (err) throw err;
        let db = client.db('ecaw');

        db.collection('projects').findOne({
            _id: parseInt(req.params.projectId)
        }, function (err, result) {
            if (err) throw err;
            if (result) {
                result.found = true;
                res.send(result);
                console.log(result);
            } else {
                res.send("Empty")
            }
        })
    });
});

//updates the project
router.post('/:username/:projectId', function (req, res) {
    mongoDB.connect(databaseURL.databaseURL, function (err, client) {
        if (err) throw err;
        let db = client.db('ecaw');
        console.log(req.body._id);
        db.collection('projects').findOne({
            _id: parseInt(req.body._id)
        }, function (err, result) {
            if (err) throw err;
            if (result) {
                //if the project exists, overwrite it
                db.collection('projects').replaceOne(
                    {_id: parseInt(req.body._id)},
                    req.body, {upsert: true}
                );
            } else {
                //if it doesn't add it to the database
                db.collection('projects').insert(req.body, function (err) {
                    if (err) throw err;
                    else console.log("updated");
                });
            }
        });

        res.send(JSON.stringify({success: true}))
    });
});
//
// router.get('/', function (req, res, next) {
//     mongoDB.connect(databaseURL.databaseURL, function (err, client) {
//         if (err) throw err;
//         let db = client.db('ecaw');
//         let document = {
//             _id: 3,
//             circle: {
//                 radius: 50
//             },
//             rect: {
//                 width: 10
//             }
//         };
//         db.collection('projects').insert(document, function (err, records) {
//             if (err) throw err;
//         })
//     });
// });

module.exports = router;
