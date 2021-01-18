const express = require('express');
const User = require('../models/user');
const router= new express.Router()

//Signup
router.post('/users',async(req,res)=>{
    console.log(req)
    const user = new User(req.body);
    
    try{
        await user.save()
        //adding authentication left
        res.status(201).send({user}) 
    }
    catch(e){
        res.status(400).send(e);
    };
});



module.exports = router;
