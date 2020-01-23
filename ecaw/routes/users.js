let express = require('express');
let router = express.Router();
let mongoDB = require('mongodb').MongoClient;
let jwt = require('jsonwebtoken');
let config = require("../config");
const databaseURL = require('../app');

let validateUser = function (req, res, next) {
    let user = req.body.username;
    let password = req.body.password;
    if (user && password) {
        mongoDB.connect(databaseURL.databaseURL, function (err, client) {
            if (err) throw err;
            let db = client.db('ecaw');
            db.collection('users').findOne({username: user},
                function (err, result) {
                    if (err) throw err;
                    //user found, check password
                    if (result) {
                        if (result.password === password) {
                            let token = jwt.sign({username: user},
                                config.secret
                            );
                            res.send({
                                success: true,
                                message: "Login successful",
                                token: token
                            });
                            req.token = token;
                            next();
                        } else {
                            res.status(401).send({
                                success: false,
                                message: "Incorrect password"
                            })
                        }
                    } else {
                        res.status(404).send({
                            success: false,
                            message: "The username is not valid"
                        })
                    }
                }
            )
        });
    } else {
        res.status(400).send({
            success: false,
            message: "Username and password have to be defined"
        })
    }
};

let updateToken = function (req) {
    mongoDB.connect(databaseURL.databaseURL, function (err, client) {
        if (err) throw err;
        let db = client.db('ecaw');
        db.collection('users').updateOne(
            {username: req.body.username},
            {$set: {jwt: req.token}},
            {upsert: true});
    });
};

let register = function (req, res) {
    let user = req.body.username;
    let password = req.body.password;

    if (user && password) {
        mongoDB.connect(databaseURL.databaseURL, function (err, client) {
            if (err) throw err;
            let db = client.db('ecaw');
            db.collection('users').findOne({username: user}, function (err, result) {
                if (err) throw err;
                if (result) {
                    res.status(409).send({
                        success: false,
                        message: "Username already taken"
                    })
                } else {
                    db.collection('users').insert({
                        username: user,
                        password: password
                    }, function (err) {
                        if (err) throw err;
                        res.send({
                            success: true,
                            message: "User successfully created"
                        })
                    });
                }
            })
        });
    } else {
        res.status(400).send({
            success: false,
            message: "Username and password have to be defined"
        })
    }
};

router.post('/auth', validateUser, updateToken);
router.post('/register', register);

module.exports = router;
