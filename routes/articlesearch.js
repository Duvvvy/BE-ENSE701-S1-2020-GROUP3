var express = require("express");
var router = express.Router();


const pg = require('pg');
const {Pool} = require('pg');

/* Create new pool*/
let conString = process.env.DATABASE_URL || 'postgres://mjlrcdotwouger:9234e9e5235b549e9389d1aab578a2c144306c4ab61b1acd052dfb87ffc645c1@ec2-35-174-127-63.compute-1.amazonaws.com:5432/da9rg6k174929g';
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
  var searchArticle = req.toLowerCase();
  console.log(searchArticle);
  pool.query("SELECT * FROM bibliographicreference WHERE article='" + searchArticle + "'", function(err, result) {
    if(err)
    {
      console.log(err);
      res.send("Not Found Article");
    }
    else
    {
      if(result.rowCount >= 1) {
        var articlesFound
        for (let row of result.rows) {
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
