let multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("File upload location : " + './uploads/' + req.decoded.username + '/' + `${req.params.projectId}` + '/');
        cb(null, './uploads/' + req.decoded.username + '/' + `${req.params.projectId}` + '/')
        //cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({
    storage: storage
});

module.exports = {
    upload: upload.single('canvas')
};