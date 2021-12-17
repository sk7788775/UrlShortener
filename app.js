//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");

const app=express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

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

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port,function() {
    console.log("Server started successfully");
});