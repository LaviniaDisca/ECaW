let jwt = require('jsonwebtoken');
const config = require('./config.js');
let mongoDB = require('mongodb').MongoClient;
const databaseURL = require('./app');

let verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

    if (token) {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(400).send({
            success: false,
            message: 'You need to pass the JWT token'
        });
    }
};

let validateToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    token = token.slice(7, token.length);
    mongoDB.connect(databaseURL.databaseURL, function (err, client) {
        if (err) throw err;
        let db = client.db('ecaw');
        db.collection('users').findOne(
            {
                username: req.decoded.username,
                jwt: token
            }, function (err, result) {
                if (err) throw err;
                if (result) {
                    next();
                } else {
                    res.status(401).send({
                        success: false,
                        message: "Invalid JWT"
                    })
                }
            });
    });
};

module.exports = {
    verifyToken: verifyToken,
    validateToken: validateToken
};
