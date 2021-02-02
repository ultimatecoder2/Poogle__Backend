const express = require('express');
const bodyParser = require('body-parser');
const Answers = require('../models/answers');
const auth = require('../middleware/auth');

const answerRouter = express.Router();

answerRouter.use(bodyParser.json());

answerRouter.route('/answers')
.get( (req, res, next) => {

    Answers.find({})
    //.populate('author')
    .then((answers) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(answers);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( (req,res,next) => {
    
    if (req.body != null) {
        //req.body.author = req.user._id;
        Answers.create(req.body)
        .then((answer) => {
            Answers.findById(answer._id)
            //.populate('author')
            .then((answer) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(answer);
            })
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        err = new Error('Answer not found in request body');
        err.status = 404;
        return next(err);
    }

})
.put(auth, (req,res,next) => {
    
    res.statusCode = 403;
    res.end('PUT operation not supported on /answers');
})
.delete(auth, (req,res,next) => {
    
    res.statusCode = 403;
    res.end('DELETE operation not supported on /answers');
});

answerRouter.route('/answers/:ansId')
.get( (req,res,next) => {
    Answers.findById(req.params.ansId)
    //.populate('author')
    .then((answer) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(answer);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put( (req, res, next) => {
    Answers.findById(req.params.ansId)
    .then((answer) => {
        if (answer != null) {
            if (!answer.author.equals(req.user._id)) {
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
                //.populate('author')
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
.delete( (req, res, next) => {

    Questions.findById(req.params.quesId)
    .then((question) => {
        if (question != null) {
            if (!question.author.equals(req.user._id)) {
                var err = new Error('You are not authorized to delete this question!');
                err.status = 403;
                return next(err);
            }
            Questions.findByIdAndRemove(req.params.ansId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp); 
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            err = new Error('Question with id ' + req.params.ansId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = answerRouter;