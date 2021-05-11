const express = require('express');
const bodyParser = require('body-parser');
const auth = require('../middleware/auth');
const cors = require('./cors');
const AnswerReactions = require('../models/answerReactions');
const User = require("../models/user");

const answerReactionRouter = express.Router();

answerReactionRouter.use(bodyParser.json());

answerReactionRouter.route('/answerReactions')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    AnswerReactions.find()
    .populate('author')
    .then((answerReactions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(answerReactions);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,auth, async (req, res, next) => {

    if (req.body != null) {
        AnswerReactions.create(req.body)
        .then((reac) => {

            AnswerReactions.findById(reac._id)
            .populate('author')
            .then((reaction) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(reaction);
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

answerReactionRouter.route('/answerReactions/:reacId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    AnswerReactions.findById(req.params.reacId)
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
    res.end('POST operation not supported on /answerReactions/'+ req.params.reacId);
})
.put(cors.corsWithOptions,auth, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /answerReactions/'+ req.params.reacId);
})
.delete(cors.corsWithOptions,auth, (req, res, next) => {
    AnswerReactions.findById(req.params.reacId)
    .then((reac) => {
        if (reac != null) {
    
            AnswerReactions.findByIdAndRemove(req.params.reacId)
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

module.exports = answerReactionRouter;