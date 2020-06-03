var express = require("express");
var router=express.Router();
var signUpChecker = require("../methods/signUpChecker");

router.get("/", function(req,res,next){
    res.send("API is working properly")
});

router.post("/", function(req,res,next){
    let checkedInfo = new signUpChecker(req.body)
    res.send(checkedInfo.checker())
});

module.exports=router;