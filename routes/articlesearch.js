var express = require("express");
var router = express.Router();

/* GET article search page. */
router.get("/", function (req, res, next) {
  res.render("articlesearch", { title: "Article search page" });
});

//Route to return articles from DB
router.post("/search", function (req, res, next) {
  res.send("Looking for article...");
});

module.exports = router;
