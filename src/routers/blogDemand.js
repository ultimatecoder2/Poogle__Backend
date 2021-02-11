const express = require('express');
const bodyParser = require('body-parser');
const BlogDemands = require('../models/blogDemands');
const auth = require('../middleware/auth');
const multer = require("multer");

const blogDemandRouter = express.Router();

blogDemandRouter.use(bodyParser.json());

blogDemandRouter.route('/blogDemands')
.get((req, res, next) => {

    BlogDemands.find({})
    .populate('author')
    .then((blogDemand) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blogDemand);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( (req,res,next) => {
    
    if (req.body != null) {
        BlogDemands.create(req.body)
        .then((blogDemand) => {
            BlogDemands.findById(blogDemand._id)
            .populate('author')
            .then((blogDemand) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(blogDemand);
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
    res.end('PUT operation not supported on /blogDemands');
})
.delete(auth, (req,res,next) => {
    
    res.statusCode = 403;
    res.end('DELETE operation not supported on /blogDemands');
});

blogDemandRouter.route('/blogDemands/:blogDemandId')
.get((req,res,next) => {
    BlogDemands.findById(req.params.blogDemandId)
    .populate('author')
    .then((blogDemand) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blogDemand);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(auth, (req, res, next) => {
    BlogDemands.findById(req.params.blogDemandId)
    .then((blogDemand) => {
        if (blogDemand != null) {
            
            BlogDemands.findByIdAndUpdate(req.params.blogDemandId, {
                $set: req.body
            }, { new: true })
            .then((blogDemand) => {
                BlogDemands.findById(blogDemand._id)
                .populate('author')
                .then((blogDemand) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(blogDemand); 
                })               
            }, (err) => next(err));
        }
        else {
            err = new Error('BlogDemand ' + req.params.blogDemandId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(auth, (req, res, next) => {

    BlogDemands.findById(req.params.blogDemandId)
    .then((blogDemand) => {
        if (blogDemand != null) {
        
            BlogDemands.findByIdAndRemove(req.params.blogDemandId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp); 
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            err = new Error('BlogDemand with id ' + req.params.blogDemandId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = blogDemandRouter;

