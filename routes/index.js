var express = require('express');
var router = express.Router();

const User=require("../models/schema");

const passport=require("passport");
const LocalStrategy=require("passport-local");
passport.use(new LocalStrategy(User.authenticate()));
/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/register",(req,res,next)=>{
  res.render("register")
});

router.post("/register",async (req,res,next)=>{
  try {
    const{name,username,email,password}=req.body
    await User.register({name,username,email},password)
    res.redirect("/login");
  } catch (error) {
    res.send("error");
  }
});

router.get("/login",(req,res,next)=>{
  res.render("login");
})

router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
}))

function isLoggedIn (req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/login")
}


router.get("/profile", isLoggedIn,(req,res,next)=>{
  res.render("profile",{user:req.user});
})


router.get("/logout",(req,res,next)=>{
  req.logout(function(error){
    if(error){return next(error);
    }
  })
  res.redirect("/login");
});

router.get("/update-password",(req,res,next)=>{
  res.render("updatepassword");
})


router.post("/update-password", isLoggedIn,async (req,res,next)=>{
  const password=req.body.password
  const user= await User.findOne({_id:req.user._id})
  await user.setPassword(password)
  await user.save()
  res.redirect("/login")
})


router.get("/edit/:id", async(req,res,next)=>{
  const show =  await User.findOne({_id:req.params.id})
  res.render("edit",{show});
})


router.post("/edit/:id",async(req,res,next)=>{
  await User.findOneAndUpdate({_id:req.params.id},{
     name:req.body.name,
     username:req.body.username,
     email:req.body.email,
  })
res.redirect("/profile")
})


router.get("/delete-user/:id",async(req,res,next)=>{
   const id=req.params.id
   await User.findOneAndDelete({_id:id})
   res.redirect("/register")

})
module.exports = router;
