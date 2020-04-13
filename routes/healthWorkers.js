const express = require('express');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

var healthWorker=require('../models/healthWorker')
var bodyParser = require('body-parser')

var healthWorkersRouter = express.Router()
healthWorkersRouter.use(bodyParser.json())

const mongoUrl=require('../config');
const conn=mongoose.createConnection(mongoUrl);

let gfs;
var postId=null;
var file=null;
conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('workers');
  });

var storage = new GridFsStorage({
        url: mongoUrl,
        file: (req, file) => {
            console.log(file)
            return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                filename: filename,
                metadata : req.body,
                bucketName: 'workers'
                };
                resolve(fileInfo);
        });
        });
        }
});
const upload = multer({ storage });

healthWorkersRouter.get('/',function(req,res){
    gfs.files.find().toArray((err, files) => {
        res.send(files)
    });
    
})
healthWorkersRouter.post('/',upload.single('file'),function(req,res){
    res.redirect('/')
})
healthWorkersRouter.get('/:filename',function(req,res){
    gfs.files.findOne({filename:req.params.filename},(err,file)=>{
        if(err){
            res.status(500).send("Error Occured");
        }
        else{
            res.send(file);
        }
    })
    
})
healthWorkersRouter.put('/:filename',function(req,res){
    console.log(req.params.filename)
    gfs.files.updateOne({filename: req.params.filename},{ $set:req.body},function(err,file){
        if(err){
            res.status(500).send("Error Occured");
        }
        else{
            res.send(file);
        }
    }
    )
})

healthWorkersRouter.delete('/:filename',function(req,res){
    gfs.remove({ filename: req.params.filename, root: 'workers' }, (err, gridStore) => {
        if (err) {
          return res.status(404).json({ err: err });
        }
        else{
            res.redirect('/');
        }
      });
})

module.exports=healthWorkersRouter;