const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


mongoose.connect(
	"mongodb://node-shop:node-shop@cluster0-shard-00-00-bui2o.mongodb.net:27017,cluster0-shard-00-01-bui2o.mongodb.net:27017,cluster0-shard-00-02-bui2o.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true" , 
	{
		useNewUrlParser : true
	}).catch((err) => console.log('Connection Failed'));

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

app.use(morgan('dev'));

app.use(express.static('uploads'))
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use('/products' , productRoutes);
app.use('/orders' , orderRoutes);
app.use('/users' , userRoutes);

app.use((req , res,next) => {
	res.header("*");

if(req.method === 'OPTIONS'){
	res.header("*");
	return res.status(400).json({});
}
next();
});


app.use((req , res , next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

app.use((err,req,res,next) => {
	res.status(err.status || 500);
	res.json({
		error : {
			message : err.message
		}
	});
});

module.exports = {app};