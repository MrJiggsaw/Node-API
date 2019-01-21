const express = require('express');
const router = express.Router();
const Product = require('./../models/product');
const mongoose  = require('mongoose');
const multer = require('multer');
const checkAuth = require('./../middleware/auth-check');


const storage = multer.diskStorage({
	destination : function(req , file , cb){
		cb(null , './uploads/')
	},
	filename : function(req , file , cb) {
		cb(null , file.originalname);
	}
});
const fileFilter = function(req , file , cb){
	if(file.mimetype === 'image/jpeg' || file.mimetype === "image/jpg" ||file.mimetype === "image/png"  ){
		cb(null , true);
	}
	else{
		cb(null , false);}
}

const upload = multer({storage , 
	limits : {
		filesize : 1024 * 1024 * 5
	} , 
	fileFilter
}) ;

router.get('/' , (request , response ,next) => {
	Product.find().then((doc) => {
		if(doc !== null){
		console.log(doc);
		return response.status(200).json({
					status : 200,
					name : doc[0].name,
					price : doc[0].price,
					productImage : doc[0].productImage
				});
		}
	}).catch((err) => {
		return response.status(400).json(err);
	});
});

router.post('/' , upload.single('productImage'),checkAuth ,(request , response ,next) => {
	const product = new Product({
		_id : new mongoose.Types.ObjectId(),
		name : request.body.name,
		price : request.body.price,
		productImage : request.file.path
	});
	product.save()
	.then((res) => {
		return response.status(200).json(res);
	})
	.catch((err) =>{
		return response.status(500).json(err);	
	});
});

router.get('/:productId' , (req , res, next) => {
	const id = req.params.productId;
	Product.findById(id).then((doc) =>{
		return res.status(200).json({
			doc
		})
	}).catch((err) => {
		return res.status(500).json({
			error : err
		})
	});
});

router.patch('/:productId' , (req,res,next) => {
	const id = req.params.productId;
	Product.update({_id : id },{$set : {name : req.body.name , price : req.body.price}})
	.then((result) => {
		return res.status(200).send('Updated successfully');
	})
	.catch((err) => {
		return res.status(400).send('Failed updating');
	});
});

router.delete('/:productId' , (req,res,next) => {
	const id = req.params.productId;
	console.log(id , typeof(id));
	Product.deleteOne({"_id" : new mongoose.Types.ObjectId(id)}).exec()
	.then((doc) => {
		return res.status(200).send('Deleted successfully');
	}).catch((err) => console.log(err));
});
module.exports = router;