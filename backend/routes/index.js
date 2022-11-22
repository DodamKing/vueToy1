var express = require('express');
var router = express.Router();
const path = require('path')
const request = require('request')

const testDB = {
	stamp : 0,
	time : 0,
}

/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../public/index.html'))
});

router.get('/test', (req, res) => {
	console.log('제발요');
	res.json('젭라')
})

router.post('/test', (req, res) => {
	const testData = req.body.input_date
	console.log(testData);
	res.json(testData)
})

// router.post('/save', (req, res) => {
// 	const name = req.body.name
// 	const date = req.body.date
// 	const hour = req.body.hour
// 	const works = req.body.works
// 	const stamp = req.body.stamp
// 	console.log(date, hour, works);

// 	testDB.stamp += stamp
// 	testDB.time = testDB.stamp / 4

// 	res.json({name, date, hour, works, stamp : testDB.stamp, time : testDB.time})
// })

module.exports = router;
