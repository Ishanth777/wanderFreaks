const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner} = require("../middleware.js");

const listingControllers = require("../controllers/listing.js");
const {validation} = require("../middleware.js");
const Listing = require("../models/listing.js")



// index route (contains all listings)
router.get("/",wrapAsync(listingControllers.index));
   
   // create route (new listing)
router.get("/new",isLoggedIn,listingControllers.renderForm);
   
router.post("/",validation, wrapAsync(listingControllers.create));


   
   // show route (shows invidual listing)
router.get("/:id", wrapAsync(listingControllers.show));
   
   // edit route 
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControllers.renderEditForm));
   
router.put("/:id",validation,isOwner,wrapAsync(listingControllers.edit));

//search
router.get("/api/search",listingControllers.search );
   
   // delete route
router.delete("/:id/delete",isLoggedIn,isOwner,wrapAsync(listingControllers.delete));
   

module.exports=router;