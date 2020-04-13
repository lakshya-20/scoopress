var mongoose=require('mongoose')

var today = new Date();
var date = today.getFullYear()+'-'+today.getMonth()+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;

var modelName="posts"

var postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    headline:{
        type:String,
        default: ""
    },
    body:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    dateCreated:{
        type:String,
        default:dateTime
    }
})

module.exports=mongoose.model(modelName,postSchema,modelName)