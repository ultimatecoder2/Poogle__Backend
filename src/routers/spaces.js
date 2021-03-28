const mongoose = require('mongoose')
const express = require('express');
const bodyParser = require('body-parser');
const Spaces = require('../models/spaces');
const auth = require('../middleware/auth');
const cors = require('./cors');
const multer = require('multer');
const sharp = require('sharp');
const formidable = require('formidable');


const spaceRouter = express.Router();

spaceRouter.use(bodyParser.json());


/*Follow and unfollow spaces*/
spaceRouter.patch('/spaces/changeFollow', async(req, res)=>{
    try{
        let user = req.user, data= req.body;
        const {type, spaceId} = data;
        let space = await Spaces.find({stringId:spaceId}); 
        if(type=="unfollow"){
            console.log("unfollow req")
            //remove interest from user and user from interests in spaces
            if(user.interests){
                user.interests = user.interests.filter((interest)=>{
                    return interest.interest!== spaceId;
                })
            }

            if(space.followers){
                space.followers = space.followers.filter((follower)=>{
                    return follower.follower!== user._id;
                })//need to check
            }
            res.send({user, space}); 

        }else if(type=="follow"){
            //add at both places
            console.log("follow req");
            if(!space.followers){
                space.followers=new Array;
            }
            if(!user.interests){
                user.interests=new Array;
            }
            const userId = mongoose.Types.ObjectId(user._id); 
            // console.log(space.followers);
            // console.log(userId);
            space.followers = space.followers.concat(userId); 
            //console.log(space.followers);// its working right
            user.interests = user.interests.concat({interest:spaceId});
            res.send({user, space});// Here spaces is not showing updated one
        }
            //Only to be uncommented after the code works
            //await user.save()
            //await space.save()

    } catch(e){
        console.log(e);
        res.status(400).send(e);
    }
})
module.exports = spaceRouter;
