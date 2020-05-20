var express = require("express");
var router = express.Router();


const pg = require('pg');
const {Pool} = require('pg');

/* Create new pool*/
let conString = process.env.DATABASE_URL || 'postgres://negtxomvpyukav:2cccea68c2c3ba807464803955c4e91fadce7e98aab3537d61072910b5aafc4b@ec2-34-195-169-25.compute-1.amazonaws.com:5432/d519qj82c2p87g';
const pool = new Pool({
  connectionString: conString,
  ssl: {
    rejectUnauthorized: false
  }
});

/* GET article search page. */
router.get("/", function (req, res, next) {
  res.render("articlesearch", { title: "Article search page" });

});

//Route to return articles from DB
router.post("/search", function (req, res, next) {
  res.send("Looking for article...");
  search(req.body.articleText)
  connectDatabase();
});

/*Connect to database*/
function connectDatabase() {
  pool.connect(function(err) {
    if(err) {
      console.log("Can not connect to the DB" + err);
    }
    else{
      console.log("connected");
    }
  }) 
}

/*Search article that was given name*/
function search(req, res, next) {
  var searchArticle = req;
  console.log(req);
  pool.query('SELECT * FROM information_schema.tables;', function(err, result) {
    if(err)
    {
      console.log(err);
    }
    else
    {
      for (let row of result.rows) {
        console.log(JSON.stringify(row));
      }
    }
  });
}

module.exports = router;
