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
  //res.send("Looking for article...");
  connectDatabase();
  search(req.body.articleText, res);
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
  pool.query("SELECT article FROM bibliographicreference WHERE" + searchArticle, function(err, result) {
    if(err)
    {
      console.log(err);
      res.send("Not Found Article");
    }

    else
    {
      if(result.fields && result.fields.length) {
        var articlesFound
        for (let row of result.fields) {
          articlesFound += JSON.stringify(row)
          console.log(row);
        }
        res.send(articlesFound);
      }
      else {
        res.send("Not Found Article");
      }
    }
  });
}

module.exports = router;
