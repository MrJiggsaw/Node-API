const express = require('express');
const router = express.Router();
const Orders = require('./../models/order');
const mongoose = require("mongoose");

router.get('/', (req , res ,next) => {
	Orders.find().then((doc) => {
		return res.status(200).json(doc);
	}).catch((err) => {
		return res.status(400).json(err);
	});
});

router.post('/', (req , res ,next) => {  
	const order = new Orders({
		_id : new mongoose.Types.ObjectId(),
		product_id : req.body.productId,
		quantity : req.body.quantity
	});
	order.save().then((result) => {
		return res.status(200).json(result);
	}).catch((err) => {
		return res.status(400).json(error);
	});

});

router.patch('/:orderId', (req , res ,next) => {
	const id  = req.params.orderId;
	Orders.update({_id : id} , {$set : {quantity : req.body.quantity}}).then((result) => {
		return res.status(200).send("Successfully updated");
	}).catch((err) => {
		return res.status(400).send("Failed deletion");
	});
});

router.delete('/:orderId', (req , res ,next) => {
	const id = req.params.orderId;
	Orders.deleteOne({_id : id}).then((result) => {
		return res.status(200).send("Successfully deleted");
	}).catch((err) => {
		return res.status(400).send("Failed deletion");
	});
});
module.exports = router;