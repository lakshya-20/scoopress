var express = require('express')
var mongoose = require('mongoose')

var Posts=require('../models/post')
var bodyParser = require('body-parser')

var postRouter = express.Router()
postRouter.use(bodyParser.json())


postRouter.get('/',function(req,res){
    Posts.find().sort({dateCreated:-1}).exec(function(err,docs){
        if(err){
            res.status(500).send("Error Occured");
        }
        else{
            res.send(docs);
        }
    })
})
postRouter.post('/',function(req,res){
    console.log("Entered")
    //req.body=req.user.username
    Posts.create(req.body,function(err,doc){
        if(err){
            res.status(500).send("Error Occured");
        }
        else{
            res.send(doc);
        }
    })
})

module.exports=postRouter;