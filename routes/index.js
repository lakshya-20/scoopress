var express = require('express');
var router = express.Router();

var loggedin=function(req,res,next){
  if(req.isAuthenticated()){
    next();
  }
  else{
    res.redirect('/login');
    console.log('User is not loggedin')
  }
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login',function(req,res,next){
  res.render('login');
});
router.get('/signup',function(req,res,next){
  res.render('signup');
});
router.get('/dashboard',function(req,res,next){
  res.render('dashboard');
});

module.exports = router;
