const express = require('express');
const bodyParser = require('body-parser');
const auth = require('../middleware/auth');
const cors = require('./cors');
const BlogComments = require('../models/blogComments');

const blogCommentRouter = express.Router();

blogCommentRouter.use(bodyParser.json());

blogCommentRouter.route('/blogComments')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    BlogComments.find()
    .populate('author')
    .then((blogComments) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blogComments);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,auth,(req, res, next) => {
    if (req.body != null) {
        req.body.author = req.user._id;
        BlogComments.create(req.body)
        .then((comment) => {
            BlogComments.findById(comment._id)
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

blogCommentRouter.route('/blogComments/:commentId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    BlogComments.findById(req.params.commentId)
    .populate('author')
    .then((comment) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(comment);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,auth,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /blogComments/'+ req.params.commentId);
})
.put(cors.corsWithOptions,auth ,(req, res, next) => {
    BlogComments.findById(req.params.commentId)
    .then((comment) => {
        if (comment != null) {
            if (!comment.author.equals(req.user._id)) {
                var err = new Error('You are not authorized to update this comment!');
                err.status = 403;
                return next(err);
            }
            req.body.author = req.user._id;
            BlogComments.findByIdAndUpdate(req.params.commentId, {
                $set: req.body
            }, { new: true })
            .then((comment) => {
                BlogComments.findById(comment._id)
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
    BlogComments.findById(req.params.commentId)
    .then((comment) => {
        if (comment != null) {
            if (!comment.author.equals(req.user._id)) {
                var err = new Error('You are not authorized to delete this comment!');
                err.status = 403;
                return next(err);
            }
            BlogComments.findByIdAndRemove(req.params.commentId)
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

module.exports = blogCommentRouter;