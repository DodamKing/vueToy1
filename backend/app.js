var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
const history = require('connect-history-api-fallback')
const helmet = require('helmet')
const request = require('request')
const geoip = require('geoip-lite')
const requestIp = require('request-ip')
const ipfilter = require('express-ipfilter').IpFilter
const cron = require('node-cron')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const apiRouter = require('./routes/api')

var app = express();
const corsOption = {
  origin : 'http://localhost:9003',
  credentials : true,
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(helmet({ contentSecurityPolicy: false }))
app.use(logger(':remote-addr :method :url :status :res[content-length] - :response-time ms'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(history())
// app.use(cors(corsOption))

app.use((req, res, next) => {
  const clientIp = requestIp.getClientIp(req)
  const testIp = "207.97.227.239"
  const client = geoip.lookup(clientIp)
  if (client && client.country !== 'KR') {
    console.log('접속 시도:', client.city, clientIp)
    return res.send('Access Denied')
  }
  next()
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet())
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(req.ip);
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// cron.schedule('* 0 * * * *', async () => {
//   const DB = require('./public/DB.json')
//   const historys = [...DB.history].reverse()
//   const today = new Date().getDate()

//   // `https://kauth.kakao.com/oauth/authorize?client_id=c10c0fad164ec38942a565862e56418e&redirect_uri=http://localhost:9022&response_type=code&scope=talk_message`

//   for await (const history of historys) {
//     if (history.name === '도담') {
//       const last = new Date(history.date).getDate()
//       if (last !== today) {
//         const authURL = 'https://kauth.kakao.com/oauth/token'
//         const authOptions = {
//           uri : authURL,
//           method : 'POST',
//           multipart : {'Content-Type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
//           body : {
//             'code' : 'eVPsjOuHCdzW8LxHpt0EmrSjSomByYsnu7CW9LU9JXwzgq9lCTdtMerkzONvXi-CpHkF5AopyNgAAAGEx_IKrA',
//             'grant_type' : 'authorization_code',
//             'clitent_id' : 'c10c0fad164ec38942a565862e56418e',
//             // 'redirect_url' : 'http://localhost:9002',
//           },
//           json : true,
//         }
//         request.post(authOptions, (err, response, body) => {
//           console.log(response, body);
//         })
//       }
//       break
//     }
//   }
//   console.log(new Date().toLocaleString(), '스케줄러 작동')
// })

module.exports = app;
