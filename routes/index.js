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
  res.render("profile");
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
module.exports = router;
