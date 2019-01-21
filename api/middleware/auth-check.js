var jwt = require('jsonwebtoken');

module.exports = (req , res , next) => {
		const token = req.headers.authorization.split(" ")[1];
		console.log(token);
		const decoded = jwt.verify(token , 'secret1');
		req.userData = decoded;
		console.log(req.userData);
		next();
}