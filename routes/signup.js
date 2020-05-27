var express = require("express");
var router=express.Router();

router.get("/", function(req,res,next){
    res.send("API is working properly")
});

router.post("/", function(req,res,next){
    res.send("API is working properly")
    console.log(req.headers)
});

module.exports=router;