const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing= require("./models/listings.js");
const path = require("path");
const Listing = require("./models/listings.js");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to Data base")
})
.catch((err)=>{
    console.log(err);
    
})
async function main(){
    await mongoose.connect(MONGO_URL)
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.get("/",(req,res)=>{
    res.send("hii i am root")
});


// app.get("/testlisting",async (req,res)=>{
//  let samplelisting = new listing({
//     title : "my villah",
//     description:"by the beach",
//     price:1200,
//     location: "calangat , goa",
//     country: "india"
//  });
//  

//index route

app.get("/listings", async(req,res)=>{
  const allListings = await listing.find({});
  res.render("listings/index.ejs", {allListings});
    
});

// new routs
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show route

app.get("/listings/:id", async (req,res)=>{
 let {id} = req.params;
const listing = await Listing.findById(id);
res.render("listings/show.ejs",{listing});
});

//creat route

app.post("/listings",async (req,res)=>{
 const newListing = new Listing(req.body.listing);
 await newListing.save();
 res.redirect("/listings");
});

// edit routs

app.get("/listings/:id/edit", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{ listing });
});

// Update route

app.put("/listings/:id", async (req,res)=>{
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});
// delete route
app.delete("/listings/:id", async (req,res)=>{
    let {id} = req.params;
   let deletedListings = await Listing.findByIdAndDelete(id);
   console.log(deletedListings);
   res.redirect("/listings");
})


app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});