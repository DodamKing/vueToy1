var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
const history = require('connect-history-api-fallback')
const helmet = require('helmet')
const request = require('request')

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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(history())
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet())
// app.use(cors(corsOption))

app.use((req, res, next) => {
  request('https://api.ip.pe.kr/json/', function(error, response, body){
    if(error){
      console.log(error);
      return;
    }
    if(!error && response.statusCode==200){
      let ip = JSON.parse(body).ip;
      let country_code = JSON.parse(body).country_code;
      if(country_code !== 'KR'){
        console.log('접속 시도 지역:', JSON.parse(body).country_name.ko)
        console.log('접속 시도 ip:', ip)
        res.send("Access Denied")
        return;
      }
    }
    next()
  })
})

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

module.exports = app;
