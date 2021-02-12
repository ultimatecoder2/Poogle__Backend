const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');

//Signup
router.post("/users", async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		//adding authentication left
		const token = await user.generateAuthToken()
		res.status(201).send({ user, token });
	} catch (e) {
		res.status(400).send(e);
	}
});

//Login
router.post('/users/login',async(req,res)=>{

    try{
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();

        res.send({user,token})
    }
    catch(e){
        res.status(400).send('Details Mismatched')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
    }
})

//Logout
router.post('/users/logout',auth, async(req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token!== req.token
        })
        await req.user.save()
        res.send()
    }
    catch(e){
        console.log("Logout error",e);
        res.status(500).send(e)
    }
});

//Logout all sessions
router.post('/users/logoutAll',auth, async(req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch(e){
        console.log(e);
        res.status(500).send()
    }

});

/*router.put('/changeInterests', auth, async (req, res, next) => {

    var newinterest = {interest:req.body.spaceId, voteCount:0};
    /*User.findByIdAndUpdate(req.body.user._id, {
        $push: { interests:  newinterest} 
    })
})*/

//get user personal details
router.get('/users/:id', async(req,res)=>{
    try{
        console.log(req.params.id);
        let user  = await User.findById(req.params.id);
        const userId = req.params.id;
        const {user_name, name, email, about, blogs, answers, questions, interests, image} = user;
        res.send({userId, user_name, name, email, about, blogs, answers, questions, interests, image})
    }catch(e){
        console.log(e)
        res.status(500).send();
    } 
});

const upload = multer({
    limits:{
        fileSize:1000000 //1mb pic size
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)//accept upload
    }
})
router.post('/users/me/image', auth,upload.single('image'), async(req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer();
    
    req.user.image = buffer
    await req.user.save();
    res.send();
}, (error, req, res, next)=>{
    res.status(400).send({error:error.message});
});

router.delete('/users/me/image', auth, async(req, res)=>{
    req.user.image = undefined
    await req.user.save();
    res.send()
})

router.get('/users/:id/image',async(req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user||!user.image)
            throw new Error();
        res.set('Content-Type','images/png')
        res.send(user.image);

    } catch(e){
        res.status(404).send();
    }
})

//Update user details
router.patch('/users/me', auth, async(req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','email','password','about','interests'];
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update);
    });
    if(!isValidOperation){
        return res.status(400).send({error:"Invalid updates!"})
    }
    try{
        const user = req.user;
		updates.forEach((update) => user[update]= req.body[update] );//TEST for about. Maybe need to add special case for that
        await user.save();
        res.send(user);
    }
    catch(e){
        res.status(400).send(e);
    }
});

//Delete user account forever
router.delete('/users/me', auth, async (req,res) =>{
    try {
        
        await req.user.remove();
        res.send(req.user);
    }
    catch(e){
        res.status(500).send()
    }
});



module.exports = router;
