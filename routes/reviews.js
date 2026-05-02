const express = require("express");
const router = express.Router({mergeParams:true});
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,isAuthor,r_validation} = require("../middleware.js");
const reviewControllers = require("../controllers/reviews.js")


//reviews post route
router.post(
       "/",
       r_validation,
       isLoggedIn,
       wrapAsync(reviewControllers.add)
     );
   

   
//delete reviews route
   
router.delete("/:r_id",isLoggedIn,isAuthor,wrapAsync(reviewControllers.delete));

module.exports = router;