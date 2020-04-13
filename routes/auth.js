var express=require('express');
var User=require('../models/user')

var router=express.Router();
module.exports=function(passport){
    router.post('/signup',function(req,res){
        var username=req.body.username
        var password=req.body.password
        User.findOne({username:username},function(err,doc){
            if(err){
                res.status(500).send('Internal Server Error');
            }
            else{
                if(doc){
                    res.status(500).send("Username already exists");
                    console.log(Date.now())
                }
                else{
                    var record=new User();
                    record.username=username;
                    record.password=record.hashPassword(password);
                    record.name=req.body.name;
                    record.age=req.body.age;
                    record.email=req.body.email;
                    record.about=req.body.about;
                    record.save(function(err,doc){
                        if(err){
                            res.status(500).send('Database Error')
                            console.log(err);
                        }
                        else{
                            res.redirect('/login')
                        }
                    })
                }
            }
        })
    });
    router.post('/login',passport.authenticate('local',{
        failureRedirect:'/login',
        successRedirect:'/dashboard',
    }),function(req,res){
        console.log("Successfully logged in")
    })
    return router;
}