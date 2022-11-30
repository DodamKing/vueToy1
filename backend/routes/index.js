var express = require('express');
var router = express.Router();
const path = require('path')
const request = require('request')

/* GET home page. */
router.get('/', function(req, res, next) {
	const code = req.query.code
	console.log(code);
	res.sendFile(path.join(__dirname, '../public/index.html'))
});

module.exports = router;
