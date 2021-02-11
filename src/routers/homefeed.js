const express = require('express');
const bodyParser = require('body-parser');
const Questions = require('../models/questions');
const auth = require('../middleware/auth');
const multer = require("multer");

const feedRouter = express.Router();

feedRouter.use(bodyParser.json());

feedRouter.route('/homeFeed')
.get((req, res, next) => {
        //JSON.parse(req.query.interests)

    Questions.find({"tagIds" : { $in: req.query.interests.split(',')}})
    .populate('author')
    .then((question) => {
        console.log("found")
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(question);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(auth, (req,res,next) => {
    
    if (req.body != null) {
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

feedRouter.route('/homeFeed/:quesId')
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
.put(auth, (req, res, next) => {
    Questions.findById(req.params.quesId)
    .then((question) => {
        if (question != null) {
            
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

module.exports = feedRouter;