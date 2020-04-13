const express = require('express');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

var Posts=require('../models/post')
var bodyParser = require('body-parser')

var postRouter = express.Router()
postRouter.use(bodyParser.json())

const mongoUrl=require('../config');
const conn=mongoose.createConnection(mongoUrl);

let gfs;
var postId=null;
var file=null;
conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('posts');
  });

var storage = new GridFsStorage({
        url: mongoUrl,
        file: (req, file) => {
            console.log(file)
            return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    console.log("entered")
                return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                filename: filename,
                metadata : req.body,
                bucketName: 'posts'
                };
                resolve(fileInfo);
        });
        });
        }
});
const upload = multer({ storage });

postRouter.get('/',function(req,res){
    /*
    Posts.find().sort({dateCreated:-1}).exec(function(err,docs){
        if(err){
            res.status(500).send("Error Occured");
        }
        else{
            res.send(docs);
        }
    })
    */

    gfs.files.find().toArray((err, files) => {
        res.send(files)
    });
    
})
postRouter.post('/',upload.single('file'),function(req,res){
    res.redirect('/')
})
postRouter.get('/:filename',function(req,res){


    gfs.files.findOne({filename:req.params.filename},(err,file)=>{
        if(err){
            res.status(500).send("Error Occured");
        }
        else{
            res.send(file);
        }
    })
    
})
postRouter.post('/:id',function(req,res){
    Posts.findByIdAndUpdate(req.params.id,{$set:req.body},function(err,doc){
        if(err){
            res.status(500).send("Error Occured");
        }
        else{
            res.send(doc);
        }
    })
})

postRouter.delete('/:filename',function(req,res){
    gfs.remove({ filename: req.params.filename, root: 'posts' }, (err, gridStore) => {
        if (err) {
          return res.status(404).json({ err: err });
        }
        else{
            res.redirect('/');
        }
      });
})

module.exports=postRouter;