const express = require('express');
const bodyParser = require('body-parser');
const auth = require('../middleware/auth');
const cors = require('./cors');
const QuestionComments = require('../models/questionComments');

const questionCommentRouter = express.Router();

questionCommentRouter.use(bodyParser.json());

questionCommentRouter.route('/questionComments')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors, (req,res,next) => {
    QuestionComments.find()
    .populate('author')
    .then((questionComments) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(questionComments);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,auth, (req, res, next) => {
    if (req.body != null) {
        QuestionComments.create(req.body)
        .then((comment) => {
            QuestionComments.findById(comment._id)
            .populate('author')
            .then((comment) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(comment);
            })
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        err = new Error('Comment not found in request body');
        err.status = 404;
        return next(err);
    }

})

questionCommentRouter.route('/questionComments/:commentId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    QuestionComments.findById(req.params.commentId)
    .populate('author')
    .then((comment) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(comment);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,auth, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /questionComments/'+ req.params.commentId);
})
.put(cors.corsWithOptions,auth, (req, res, next) => {
    QuestionComments.findById(req.params.commentId)
    .then((comment) => {
        if (comment != null) {
            if (!comment.author.equals(req.user._id)) {
                var err = new Error('You are not authorized to update this comment!');
                err.status = 403;
                return next(err);
            }
            req.body.author = req.user._id;
            QuestionComments.findByIdAndUpdate(req.params.commentId, {
                $set: req.body
            }, { new: true })
            .then((comment) => {
                QuestionComments.findById(comment._id)
                .populate('author')
                .then((comment) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(comment); 
                })               
            }, (err) => next(err));
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,auth, (req, res, next) => {
    QuestionComments.findById(req.params.commentId)
    .then((comment) => {
        if (comment != null) {
    
            QuestionComments.findByIdAndRemove(req.params.commentId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp); 
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = questionCommentRouter;