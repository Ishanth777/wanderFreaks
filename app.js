const express = require("express");
require('dotenv').config();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

//routes
const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const users = require("./routes/users.js");

const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const port = 7070;
const app = express();

const dburl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dburl);
    console.log("Connected to MongoDB");
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

main().catch((err) => console.log(err));

const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret : process.env.SECRET
    },
    touchAfter: 24 * 3600
});

// session and cookies
const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave:false,
    saveUninitialized : true,
    cookie:{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httponly : true
    }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware for flash
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.get("/",(req,res)=>{
    res.render("includes/home.ejs");
})

//listing routes

app.use("/listings",listings);


//review routes

app.use("/listings/:id/reviews",reviews);

//user routes

app.use("/",users);


// catches if that route exists
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})
//error handling middleware
app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"} = err;
    res.render("error.ejs",{status,message});
});


app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});

