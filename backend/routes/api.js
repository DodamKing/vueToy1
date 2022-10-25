var express = require('express');
var router = express.Router();
const fs = require('fs')

const DB = require('../public/DB.json')

router.get('/test', function(req, res, next) {
	console.log('들어오냐');
	res.json({data : 'api 테스트 용'})
});

router.get('/list', (req, res) => {
	res.json(DB.list)
})

router.post('/list', (req, res) => {
	const stampCnt = req.body.stampCnt
	const list = req.body.list

	if (stampCnt === 'half') {
		DB.list.half = list
	}
	else if (stampCnt === 'one') DB.list.one = list
	else if (stampCnt === 'two') DB.list.two = list
	else if (stampCnt === 'three') DB.list.three = list
	else if (stampCnt === 'four') DB.list.four = list

	fs.writeFileSync('public/DB.json', JSON.stringify(DB))
	res.json(DB.list)
})

router.post('/save', (req, res) => {
	const name = req.body.name
	const date = req.body.date
	const hour = req.body.hour
	const works = req.body.works
	const stamps = req.body.stamps
	const cnt = stamps.reduce((a, b) => (a + b))

	for (let i=0; i<works.length; i++) {
		let idx = 0
		if (DB.history.length !== 0) idx = DB.history[DB.history.length-1].idx + 1
		const data = {
			idx,
			name,
			date,
			hour,
			work : works[i],
			record : new Date().toLocaleString(),
			stamp : stamps[i],
		}
		DB.history.push(data)
	}

	if (name === '서연') {
		DB.stamp[0].cnt += cnt
		DB.stamp[0].time = DB.stamp[0].cnt / 4
		fs.writeFileSync('public/DB.json', JSON.stringify(DB))
		res.json({name, stamp : DB.stamp[0].cnt, time : DB.stamp[0].time})
	}
	else {
		DB.stamp[1].cnt += cnt
		DB.stamp[1].time = DB.stamp[1].cnt / 4
		fs.writeFileSync('public/DB.json', JSON.stringify(DB))
		res.json({name, stamp : DB.stamp[1].cnt, time : DB.stamp[1].time})
	}
})

router.get('/history', (req, res) => {
	res.json(DB)
})

router.get('/history/delete/:idx', (req, res) => {
	const idx = parseInt(req.params.idx)
	const history = DB.history

	for (let i=0; i<history.length; i++) {
		if (history[i].idx === idx) {
			const name = history[i].name
			if (name === '서연') {
				DB.stamp[0].cnt -= history[i].stamp
				DB.stamp[0].time = DB.stamp[0].cnt / 4
			}
			else {
				DB.stamp[1].cnt -= history[i].stamp
				DB.stamp[1].time = DB.stamp[1].cnt / 4
			}
			DB.history.splice(i, 1)
			fs.writeFileSync('public/DB.json', JSON.stringify(DB))
			return res.json(DB)
		}
	}
})

router.post('/history/use', (req, res) => {
	const name = req.body.name
	const time = req.body.time
	const stamp = parseInt(time) * 4
	
	if (name === 's') {
		DB.stamp[0].cnt -= stamp
		DB.stamp[0].time -= time
	}
	else {
		DB.stamp[1].cnt -= stamp
		DB.stamp[1].time -= time
	}

	fs.writeFileSync('public/DB.json', JSON.stringify(DB))

	res.json({stamp : DB.stamp})
})

module.exports = router;
