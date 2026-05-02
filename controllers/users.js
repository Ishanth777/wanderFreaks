const User = require("../models/user.js");
const passport = require("passport");

module.exports.signupR=(req,res)=>{
       res.render("users/signup.ejs");
}

module.exports.signup=async(req,res,next)=>{
       try{
       let {email,username,password} = req.body;
       const new_user = new User({
              email,
              username
       });
       await User.register(new_user,password);
       req.flash("success","welcome to wanderfreaks!!");
       req.logIn(new_user,(err)=>{
              if(err){
                     next(err);
              }
              req.flash("success","welcome to wanderfreaks!!");
              res.redirect("/listings");
       });

       ;
}catch(e){
       req.flash("error",e.message);
       res.redirect("/signup");

}

};

module.exports.loginR=(req,res)=>{
       res.render("users/login.ejs");
}
module.exports.login=async (req, res) => {
       req.flash("success", "Welcome to Wanderfreaks!!");
       let redirectUrl = res.locals.redirectUrl ||"/listings";
       res.redirect(redirectUrl);
       
}

module.exports.logout=(req,res,next)=>{
       req.logOut((err)=>{
              if(err){
                     next(err);
              }
              req.flash("success","successfully logged out");
              res.redirect("/listings");
       });

};

module.exports.show=(req,res)=>{
       res.render("users/display.ejs");
};