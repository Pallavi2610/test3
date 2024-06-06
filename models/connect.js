const mongoose=require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/tt3")
.then(()=>console.log("db connect"))
.catch((error)=>console.log("error.meassage"))