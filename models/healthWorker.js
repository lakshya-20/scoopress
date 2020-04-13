var mongoose=require('mongoose')

var today = new Date();
var date = today.getFullYear()+'-'+today.getMonth()+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;

var modelName="healthWorkers"

var contactSchema = new mongoose.Schema({
    phone:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    }
})

var healthWorkerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        required:true,
    },
    gender:{
        type:String,
        required:true,
    },
    designation:{
        type:String,
        required:true,
    },
    contact:contactSchema
    
})

module.exports=mongoose.model(modelName,healthWorkerSchema,modelName)