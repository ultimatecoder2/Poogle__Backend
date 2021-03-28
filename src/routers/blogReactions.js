const express = require('express');
const bodyParser = require('body-parser');
const auth = require('../middleware/auth');
const cors = require('./cors');
const BlogReactions = require('../models/blogReactions');

const blogReactionRouter = express.Router();

blogReactionRouter.use(bodyParser.json());

blogReactionRouter.route('/blogReactions')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    BlogReactions.find()
    .populate('author')
    .then((blogReactions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blogReactions);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,auth, (req, res, next) => {
    if (req.body != null) {
        BlogReactions.create(req.body)
        .then((reac) => {
            BlogReactions.findById(reac._id)
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
        err = new Error('Reaction not found in request body');
        err.status = 404;
        return next(err);
    }

})

blogReactionRouter.route('/blogReactions/:reacId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    BlogReactions.findById(req.params.reacId)
    .populate('author')
    .then((reac) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(reac);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,auth, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /blogReactions/'+ req.params.reacId);
})
.put(cors.corsWithOptions,auth, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /blogReactions/'+ req.params.reacId);
})
.delete(cors.corsWithOptions,auth, (req, res, next) => {
    BlogReactions.findById(req.params.reacId)
    .then((comment) => {
        if (comment != null) {
    
            BlogReactions.findByIdAndRemove(req.params.reacId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp); 
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            err = new Error('Reaction ' + req.params.reacId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = blogReactionRouter;