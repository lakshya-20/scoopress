const express = require('express');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

var workers=require('../models/post')
var bodyParser = require('body-parser')

var healthWorkerRouter = express.Router()
healthWorkerRouter.use(bodyParser.json())

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
var randomFilename=null

crypto.randomBytes(24, function(err, buffer) {
    randomFilename = buffer.toString('hex');
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
                const filename = randomFilename+ path.extname(file.originalname);
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

healthWorkerRouter.get('/',function(req,res){
   gfs.files.find().sort({_id:-1}).toArray((err, files) => {
    if (!files || files.length === 0) {
      res.render('workers', { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render('workers', { files: files });
    }
  });
})
healthWorkerRouter.get('/new',function(req,res){
  gfs.files.find().sort({_id:-1}).toArray((err, files) => {
   if (!files || files.length === 0) {
     res.render('newWorker', { files: false });
   } else {
     files.map(file => {
       if (
         file.contentType === 'image/jpeg' ||
         file.contentType === 'image/png'
       ) {
         file.isImage = true;
       } else {
         file.isImage = false;
       }
     });
     res.render('newWorker', { files: files });
   }
 });
})
healthWorkerRouter.get('/image/:filename',(req,res)=>{
    gfs.files.findOne({filename:req.params.filename},(err,file)=>{
        if(!file || file.length===0){
            return res.status(404).json({
                err :'No file exists'
            });
        }
        /*
        if(file.contentType.match(/\.(jpg|jpeg|png|gif)$/)) {
            const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
        }*/
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            // Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
          }
        else{
            return res.status(404).json({
                err :'No file exists'
            });
        }
    });
});

healthWorkerRouter.post('/',upload.single('file',10),function(req,res){
    crypto.randomBytes(24, function(err, buffer) {
        randomFilename = buffer.toString('hex');
      });
    res.redirect('/healthWorkers/new')
})
healthWorkerRouter.get('/:filename',function(req,res){


    gfs.files.findOne({filename:req.params.filename},(err,file)=>{
        if(err){
            res.status(500).send("Error Occured");
        }
        else{
            res.send(file);
        }
    })
    
})
healthWorkerRouter.put('/:filename',function(req,res){
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

healthWorkerRouter.get('/delete/:filename',function(req,res){
    gfs.remove({ filename: req.params.filename, root: 'workers' }, (err, gridStore) => {
        if (err) {
          return res.status(404).json({ err: err });
        }
        else{
            res.redirect('/healthWorkers/new');
        }
      });
})

module.exports=healthWorkerRouter;