const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("/Users/ishanthg/Desktop/project/models/listing.js");

const url = 'mongodb://127.0.0.1:27017/wander';

async function main() {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
}


main().catch((err) => console.log(err));

const initDb = async()=>{
       await Listing.deleteMany({});
       const updatedData = initdata.data.map((obj) => ({
        ...obj,
        owner: "69ef1ee5f234a31b471238e2"
    }));

    await Listing.insertMany(updatedData);
       console.log("data sucessfully inserted");
}
initDb();