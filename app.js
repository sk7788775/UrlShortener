//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
// const ShortUrl=require("./models/shortUrl");
const shortId=require("shortid");

const app=express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb+srv://<USER_NAME>:<PASSWORD>@cluster0.s6tiu.mongodb.net/userDB?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema={
    email: String,
    password: String
};

const shortUrlSchema=new mongoose.Schema({
    full: {
        type: String,
        required: true
    },
    short: {
        type: String,
        required: true,
        default: shortId.generate
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    }
});

const User=new mongoose.model("User",userSchema);
const ShortUrl=new mongoose.model("ShortUrl",shortUrlSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/logout",function(req,res){
    res.render("home");
});

app.get("/shortMyUrl",(req,res)=>{
    res.render("shortMyurl");
})

app.post("/register",function(req,res) {
    const newUser=new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err) {
        if(err) {
            console.log(err);
        } else {
            // res.render("shortMyUrl");
            res.render("success");
        }
    });
});

app.post("/login",function(req,res) {
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username},function(err,foundUser){
        if(err) {
            console.log(err);
        } else {
            if(foundUser) {
                if(foundUser.password===password) {
                    res.render("shortMyUrl");
                } else {
                    res.render("failure");
                }
            }
        }
    });
});

app.post("/shortUrls", async (req,res)=> {
    await ShortUrl.create({
        full: req.body.fullUrl
    });
    res.redirect("urlData");
});

// User.find(function(err,user) {
//     if(err) {
//         console.log("Error");
//     } else {
//         console.log(user);
//     }
// });

// ShortUrl.find(function(err,url) {
//     if(err) {
//         console.log("Error");
//     } else {
//         console.log(url);
//     }
// });

app.get("/urlData",async (req,res)=>{
    const shortUrls=await ShortUrl.find();
    res.render("urlData",{shortUrls:shortUrls});
});

app.get("/:shortUrl",async(req,res) => {
    const shortUrl=await ShortUrl.findOne({short: req.params.shortUrl});
    if(shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.full);
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port,function() {
    console.log("Server started successfully");
});