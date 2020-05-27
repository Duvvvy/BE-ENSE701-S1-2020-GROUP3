var express = require("express");
var router=express.Router();

router.get("/", function(req,res,next){
    res.send("API is working properly")
});

router.post("/", function(req,res,next){
    res.send("API is working properly")
    let sighUpChecker = new signUpChecker(req.headers)
    sighUpChecker.test();
});

module.exports=router;