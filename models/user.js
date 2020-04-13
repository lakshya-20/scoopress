var mongoose=require('mongoose')
var bcrypt=require('bcrypt-nodejs')

model_name='users'

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;

var userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        default: "  "
    },
    email:{
        type:String
    },
    age:{
        type:Number,
        defalut:0
    },
    dateCreated:{
        type:String,
        default:dateTime
    },
    about:{
        type:String,
        default:" "
    }

})

userSchema.methods.hashPassword=function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10))
}

userSchema.methods.comparePassword=function(password,hash){
    return bcrypt.compareSync(password,hash);
}

module.exports = mongoose.model(model_name, userSchema, model_name);