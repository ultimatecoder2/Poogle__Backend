const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const auth = require('../middleware/auth');
//Signup
router.post("/users", async (req, res) => {
	console.log(req);
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
        const token = await user.generateAuthToken()
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

//get user personal details
router.get('/users/me', auth, async(req,res)=>{
    res.send(req.user); 
});

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
