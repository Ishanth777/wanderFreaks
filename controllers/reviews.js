const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.add=async (req, res) => {
       let { id } = req.params;
   
       let curr_listing = await Listing.findById(id);
       if (!curr_listing) {
         throw new ExpressError(404, "Listing not found");
       }
      
   
       let curr_review = new Review(req.body.review);
       curr_review.author =req.user._id;
       
   
       await curr_review.save();
   
       curr_listing.reviews.push(curr_review);
       await curr_listing.save();
   
       res.redirect(`/listings/${id}`);
}

module.exports.delete=async (req,res)=>{
       let {id,r_id} = req.params;
       await Listing.findByIdAndUpdate(id,{$pull:{reviews:r_id}});
       await Review.findByIdAndDelete(r_id);
       res.redirect(`/listings/${id}`);
   
   }


     