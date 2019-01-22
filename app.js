const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');	


mongoose.connect(
	"mongodb+srv://node-shop:node-shop@cluster0-bui2o.mongodb.net/test?retryWrites=true" , 
	{
		useNewUrlParser : true,
		useCreateIndex : true
	}).catch((err) => console.log('Connection Failed'));

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

app.use(morgan('dev'));
app.use(cors());

app.use(express.static('uploads'))
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use('/products' , productRoutes);
app.use('/orders' , orderRoutes);
app.use('/users' , userRoutes);

app.use((req , res,next) => {
if(req.method === 'OPTIONS'){
	res.header("*");
	return res.status(400).json({});
}
next();
});

app.use(function(req , res , next)  {
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