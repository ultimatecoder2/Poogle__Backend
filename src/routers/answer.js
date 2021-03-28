const express = require('express');
const bodyParser = require('body-parser');
const Answers = require('../models/answers');
const auth = require('../middleware/auth');
const cors = require('./cors');
const answerRouter = express.Router();

answerRouter.use(bodyParser.json());

answerRouter.route('/answers')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req, res, next) => {

    Answers.find({})
    .populate('author')
    .then((answers) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(answers);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,auth, (req,res,next) => {
    
    if (req.body != null) {
        Answers.create(req.body)
        .then((answer) => {
            Answers.findById(answer._id)
            .populate('author')
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
.put(cors.corsWithOptions,auth, (req,res,next) => {
    
    res.statusCode = 403;
    res.end('PUT operation not supported on /answers');
})
.delete(cors.corsWithOptions,auth, (req,res,next) => {
    
    res.statusCode = 403;
    res.end('DELETE operation not supported on /answers');
});

answerRouter.route('/answers/:ansId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    Answers.findById(req.params.ansId)
    .populate('author')
    .then((answer) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(answer);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,auth, (req, res, next) => {
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
.delete(cors.corsWithOptions,auth, (req, res, next) => {

    Answers.findById(req.params.ansId)
    .then((answer) => {
        if (answer != null) {
            /*if (!question.author.equals(req.user._id)) {
                var err = new Error('You are not authorized to delete this question!');
                err.status = 403;
                return next(err);
            }*/
            Answers.findByIdAndRemove(req.params.ansId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp); 
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            err = new Error('Answer with id ' + req.params.ansId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = answerRouter;