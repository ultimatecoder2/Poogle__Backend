const express = require('express');
const bodyParser = require('body-parser');
const Spaces = require('../models/spaces');
const auth = require('../middleware/auth');
const cors = require('./cors');
const multer = require('multer');
const sharp = require('sharp');
const formidable = require('formidable');


const followSpaceRouter = express.Router();

followSpaceRouter.use(bodyParser.json());

followSpaceRouter.route('/followedSpaces')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req, res, next) => {

    Spaces.find({"stringId" : { $in: req.query.interests.split(',')}})
    .then((spaces) => {
        res.statusCode = 200,
        res.setHeader('Content-Type', 'application/json');
        res.json(spaces);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,(req, res, next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported on /spaces');
})
.put(cors.corsWithOptions,auth, (req, res, next) => {

    res.statusCode = 403;
    res.end('PUT operation not supported on /spaces');
})
.delete(cors.corsWithOptions,auth, (req, res, next) => {

    res.statusCode = 403;
    res.end('DELETE operation not supported on /spaces');
})

/*spaceRouter.route('/spaces/:spaceId')
.get( (req,res,next)=> {
    
    Questions.find({})
    .populate('author')
    .then((question) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(question);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(auth, (req,res,next) => {
    
    if (req.body != null) {
        req.body.author = req.user._id;
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
    res.end('PUT operation not supported on /spaces/:spaceId');
})
.delete(auth, (req,res,next) => {
    
    res.statusCode = 403;
    res.end('DELETE operation not supported on /spaces/:spaceId');
});*/

const upload = multer({
    limits:{
        fileSize:3000000 //3mb max size of image
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

followSpaceRouter.post('/spaces/me/image',upload.single('image'), async(req,res) => {
    const buffer = await sharp(req.file.buffer).png().toBuffer();
    const name = req.body.name
    const stringId = req.body.stringId
    const newspace  = new Spaces({name, stringId, image:buffer});
    try{
        await newspace.save();
        res.send();
    }catch(e){
        res.status(400).send(e);
    }
}, (error, req, res, next)=>{
    res.status(400).send({error:error.message});
});

followSpaceRouter.get('/spaces/:id/image',async(req, res)=>{
    try{
        const space = await Spaces.findById(req.params.id);
        if(!space||!space.image)
            throw new Error();
        res.set('Content-Type','images/png')
        res.send(space.image)

    } catch(e){
        res.status(404).send();
    }
})

module.exports = followSpaceRouter;