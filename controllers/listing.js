const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js");
const { populate } = require("../models/user.js");
module.exports.index=async(req,res)=>{
       const listings = await Listing.find({});
      
       res.render("listings/index.ejs",{listings,req});
   
};

module.exports.renderForm=(req,res)=>{
       res.render("listings/create.ejs");
   };

module.exports.create=async(req,res,next)=>{
       let newdata = req.body.listing;
       let newlisting = new Listing(newdata);
       newlisting.owner = req.user._id;
       await newlisting.save();
       req.flash("success","New listing addded!!")
       res.redirect("/listings");
   };

   module.exports.show=async (req,res)=>{
       let {id} = req.params;
       const newlisting = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
       if(!newlisting){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
       }
       res.render("listings/show.ejs",{newlisting});
   };
module.exports.renderEditForm=async (req,res)=>{
       let {id} = req.params;
       let editlisting = await Listing.findById(id);
       res.render("listings/edit.ejs",{editlisting});
   
};

module.exports.edit = async(req,res)=>{
       let {id} = req.params;
       let newdata = req.body.listing;
       await Listing.findByIdAndUpdate(id,newdata);
       res.redirect("/listings");
};

module.exports.delete=async (req,res)=>{
       let {id} = req.params;
       await Listing.findByIdAndDelete(id);
       req.flash("success","Listing deleted");
       res.redirect("/listings");
};

module.exports.search=async (req, res) => {
       try {
         const { query } = req.query;
     
         // If nothing typed → redirect back
         if (!query || query.trim() === "") {
           return res.redirect("/listings");
         }
     
         // Search in DB (case-insensitive)
         const listings = await Listing.find({
           title: { $regex: query, $options: "i" }
         });
     
         res.render("listings/index.ejs", {listings});
     
       } catch (err) {
         console.error(err);
         res.status(500).send("Search failed");
       }
     }