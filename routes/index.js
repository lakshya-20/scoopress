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
  res.redirect('/posts/top5')
});
router.get('/login',function(req,res,next){
  res.render('login');
});
router.get('/signup',function(req,res,next){
  res.render('signup');
});
router.get('/dashboard',loggedin,function(req,res,next){
  res.redirect('/posts/dashboard');
});
router.get('/newPost',loggedin,function(req,res){
  res.render('newPost')
})
router.get('/news',function(req,res){
  res.redirect('/posts/')
})
router.get('/newWorker',loggedin,function(req,res){
  res.render('newWorker')
})
router.get('/workers',function(req,res){
  res.redirect('/healthWorkers/')
})
router.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect('/'); 
})

router.get('/try',loggedin,function(req,res){
  res.render('try')
})
module.exports = router;
