var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var session=require('express-session');
var passport=require('passport');

require('./utils/passport')(passport);
const url=require('./config');
//var connect=mongoose.connect('mongodb://localhost:27017/blogs');  
var connect=mongoose.connect(url.dburl);
connect.then((db) =>{
  console.log('Connected correctly to server');
},(err)=>{console.log(err)});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var auth=require('./routes/auth')(passport);
var postRouter = require('./routes/posts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret key',
  saveUnitialized: false,
  resave : false
}))

app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth',auth);
app.use('/posts',postRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
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
