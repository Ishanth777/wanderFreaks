const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");

const { ref } = require("joi");
const { type } = require("../schema.js");
const new_schema = Schema({
       title:{
             type : String,
             required : true
       },
       description : String,
       image : {
              filename :{
                     type:String,
                     default:"sample"
              } ,
              url: {
                     type: String,
                     trim: true,
                     set: (v) =>
                       !v || v.trim() === ""
                         ? "https://images.unsplash.com/photo-1586810724476-c294fb7ac01b?q=80&w=1036&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                         : v
                   }
              
       },
       country : String,
       price : Number,
       location : String,
       reviews :[
              {
                     type : Schema.Types.ObjectId,
                     ref : "Review",
              }
       ],
       owner:{
              type:Schema.Types.ObjectId,
              ref:"User",
       }
});

new_schema.post("findOneAndDelete", async function (doc) {

       if (doc && doc.reviews.length) {
           await Review.deleteMany({
               _id: { $in: doc.reviews }
           });
       }
   });


const Listing = mongoose.model("Listing",new_schema);






module.exports = Listing;
