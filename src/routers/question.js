const express = require('express');
const bodyParser = require('body-parser');
const Questions = require('../models/questions');
const auth = require('../middleware/auth');
const multer = require("multer");
const cors = require('./cors');
const questionRouter = express.Router();

questionRouter.use(bodyParser.json());

questionRouter.route('/questions')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req, res, next) => {

    Questions.find({})
    .populate('author')
    .then((question) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(question);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,auth, (req,res,next) => {
    
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
.put(cors.corsWithOptions,auth, (req,res,next) => {
    
    res.statusCode = 403;
    res.end('PUT operation not supported on /questions');
})
.delete(cors.corsWithOptions,auth, (req,res,next) => {
    
    res.statusCode = 403;
    res.end('DELETE operation not supported on /questions');
});

questionRouter.route('/questions/:quesId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    Questions.findById(req.params.quesId)
    .populate('author')
    .then((question) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(question);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,auth, (req, res, next) => {
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
.delete(cors.corsWithOptions,auth, (req, res, next) => {

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


//Paginated api to get questions. Contains a query parameter "userId". 
// If we pass userId, then it will fetch questions posted by that user,
// otherwise questions will be selected from all questions.

questionRouter.get("/userquestions", auth, async (req, res) => {
	try {
        const {userId, Limit, Skip} = req.query;
        let limit = Limit?parseInt(Limit):12;
        let skip = Skip?parseInt(Skip):0;
        let questions, count=0;
        if(userId){
		    questions = await Questions.find({"author":userId}).populate('author').sort({"updatedAt":-1}).skip(skip).limit(limit);
            count = await Questions.find({"author":userId}).countDocuments()
        }else{
            questions = await Questions.find({}).populate('author').sort({"updatedAt":-1}).skip(skip).limit(limit);
            count = await Questions.find({}).countDocuments()
		}
        res.status(200).send({questions, count})
	} catch (e) {
		console.log(e);
		res.status(500).send();
	}
});

module.exports = questionRouter;