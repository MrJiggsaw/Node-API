const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const mongoose = require("mongoose");
const  bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signup' , (req , res , next) => {
	User.find().then((result) => {
		result.map(users => {
			if(users.email === req.body.email){
				return res.status(400).send('Email already exists');
			}	
		});
    bcrypt.hash(req.body.password , 10, function(err, hash) {
    	if(err){return res.status(500).send(err);}
    	else{
    		const user = new User({
    			_id : new mongoose.Types.ObjectId(),
    			email : req.body.email,
    			password : hash
    		});
    		user.save().then((result) => {
    			return res.status(200).send(result);
    		}).catch((err) => {
    			return res.status(500).send(err);
    		});
    	}
	});
			
	}).catch((err) => res.status(500).send(err));

});

router.get('/' , (req ,res ,next) => {
	User.find().then((result) => {
		return res.status(200).json(result);
	}).catch((err) => res.status(500).send(err));
});

router.delete('/:userId' , (req , res , next) => {
	const id = req.params.userId;
	User.deleteOne({_id : id}).then((result) => {
		return res.status(200).send("Deleted User");
	}).catch((err) => {
		return res.status(200).send(err);
	});
});

router.post('/login' , (req,res,next) => {
	User.find({email : req.body.email}).then((result) => {
		console.log(result);
		if(result < 1){return res.status(400).send('User not found');}
		else{
			bcrypt.compare(req.body.password , result[0].password , (err,response) => {
				if(response === true){
					const token = jwt.sign(
					{
						email : result[0].email,
						userId : result[0]._id
					},
					'secret1',
					{
						expiresIn : "1w"
					});
					return res.status(200).send({
						message : "User authenticated successfully",
						token
					});	
				}
				return res.status(409).send("Password incorrect");
			});
		}
	}).catch((err) => res.status(400).send(err));
});

module.exports  = router;