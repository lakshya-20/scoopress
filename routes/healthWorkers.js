var express = require('express')
var mongoose = require('mongoose')

var HealthWorkers=require('../models/healthWorker')
var bodyParser = require('body-parser')

var healthWorkersRouter = express.Router()
healthWorkersRouter.use(bodyParser.json())


healthWorkersRouter.get('/',function(req,res){
    HealthWorkers.find().sort({dateCreated:-1}).exec(function(err,docs){
        if(err){
            res.status(500).send("Error Occured");
        }
        else{
            res.send(docs);
        }
    })
})
healthWorkersRouter.post('/',function(req,res){
    HealthWorkers.create(req.body,function(err,doc){
        if(err){
            res.status(500).send("Error Occured");
        }
        else{
            res.send(doc);
        }
    })
})
healthWorkersRouter.get('/:id',function(req,res){
    HealthWorkers.findById({_id:req.params.id},function(err,doc){
        if(err){
            res.status(500).send("Error Occured");
        }
        else{
            res.send(doc);
        }
    })
})
healthWorkersRouter.post('/:id',function(req,res){
    HealthWorkers.findByIdAndUpdate(req.params.id,{$set:req.body},function(err,doc){
        if(err){
            res.status(500).send("Error Occured");
        }
        else{
            res.send(doc);
        }
    })
})


module.exports=healthWorkersRouter;