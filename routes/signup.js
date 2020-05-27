var express = require("express");
var router=express.Router();

router.get("/", function(req,res,next){
    res.send("API is working properly")
});

router.post("/", function(req,res,next){
    let sighUpChecker = new signUpChecker(req.body)
    res.send(sighUpChecker.username)
});

module.exports=router;