const express = require('express');
const bodyParser = require('body-parser');
const Questions = require('../models/questions');
const auth = require('../middleware/auth');
const multer = require("multer");

// STORAGE MULTER CONFIG
/*let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/questions");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

const upload = multer({ storage: storage }).single("file");*/

const questionRouter = express.Router();

questionRouter.use(bodyParser.json());

questionRouter.route('/questions')
.get((req, res, next) => {

    Questions.find({})
    .populate('author')
    .then((question) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(question);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( (req,res,next) => {
    
    if (req.body != null) {
        //req.body.author = req.user._id;
        Questions.create(req.body)
        .then((question) => {
            Questions.findById(question._id)
            .populate('author')
            .then((question) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(question);
            })
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        err = new Error('Question not found in request body');
        err.status = 404;
        return next(err);
    }

})
.put(auth, (req,res,next) => {
    
    res.statusCode = 403;
    res.end('PUT operation not supported on /questions');
})
.delete(auth, (req,res,next) => {
    
    res.statusCode = 403;
    res.end('DELETE operation not supported on /questions');
});

questionRouter.route('/questions/:quesId')
.get((req,res,next) => {
    Questions.findById(req.params.quesId)
    .populate('author')
    .then((question) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(question);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put( (req, res, next) => {
    Questions.findById(req.params.quesId)
    .then((question) => {
        if (question != null) {
            if (!question.author.equals(req.user._id)) {
                var err = new Error('You are not authorized to update this question!');
                err.status = 403;
                return next(err);
            }
            req.body.author = req.user._id;
            Questions.findByIdAndUpdate(req.params.quesId, {
                $set: req.body
            }, { new: true })
            .then((question) => {
                Questions.findById(question._id)
                .populate('author')
                .then((question) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(question); 
                })               
            }, (err) => next(err));
        }
        else {
            err = new Error('Question ' + req.params.quesId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(auth, (req, res, next) => {

    Questions.findById(req.params.quesId)
    .then((question) => {
        if (question != null) {
            if (!question.author.equals(req.user._id)) {
                var err = new Error('You are not authorized to delete this question!');
                err.status = 403;
                return next(err);
            }
            Questions.findByIdAndRemove(req.params.quesId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp); 
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            err = new Error('Question with id ' + req.params.quesId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = questionRouter;