const mongoose=require("mongoose");

const plm=require("passport-local-mongoose");
const schema= mongoose.Schema({
    name:String,
    username:String,
    email:String,
    password:String,
})
schema.plugin(plm);
module.exports=mongoose.model("user",schema);