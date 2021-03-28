const express = require('express');
const bodyParser = require('body-parser');
const auth = require('../middleware/auth');
const cors = require('./cors');
const QuestionReactions = require('../models/questionReactions');

const questionReactionRouter = express.Router();

questionReactionRouter.use(bodyParser.json());

questionReactionRouter.route('/questionReactions')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    QuestionReactions.find()
    .populate('author')
    .then((questionReactions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(questionReactions);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,auth, (req, res, next) => {
    if (req.body != null) {
        QuestionReactions.create(req.body)
        .then((reac) => {
            QuestionReactions.findById(reac._id)
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

questionReactionRouter.route('/questionReactions/:reacId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    QuestionReactions.findById(req.params.reacId)
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
    res.end('POST operation not supported on /questionReactions/'+ req.params.reacId);
})
.put(cors.corsWithOptions,auth, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /questionReactions/'+ req.params.reacId);
})
.delete(cors.corsWithOptions,auth, (req, res, next) => {
    QuestionReactions.findById(req.params.reacId)
    .then((comment) => {
        if (comment != null) {
    
            QuestionReactions.findByIdAndRemove(req.params.reacId)
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

module.exports = questionReactionRouter;