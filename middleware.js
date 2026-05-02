const listing = require("./models/listing.js");
const review = require("./models/review.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // rename for clarity
        req.flash("error", "Must login");
        return res.redirect("/login");
    }
    next();
};

module.exports.storeRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl; 
    }
    next();
};

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let curr_listing = await listing.findById(id);
    if(!curr_listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you don't have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor = async (req,res,next)=>{
    let {id,r_id} = req.params;
    let curr_review = await review.findById(r_id);
    if(!curr_review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you don't have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// error middleware for schema validation for listing
module.exports.validation=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

// error middleware for schema validation for ratings
module.exports.r_validation = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map(el => el.message).join(", ");
      throw new ExpressError(400, errMsg);
    }
  
    next();
};