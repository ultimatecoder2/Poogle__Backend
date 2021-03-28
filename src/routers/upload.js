const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('./cors');

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, jpeg, mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

const upload = multer({ storage: storage }).single("file");

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/uploadfiles')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /uploadfiles');
})
.post(cors.corsWithOptions,(req, res) => {
    /*res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);*/

    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename });
    });
})
.put(cors.corsWithOptions,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /uploadfiles');
})
.delete(cors.corsWithOptions,(req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /uploadfiles');
});

module.exports = uploadRouter;