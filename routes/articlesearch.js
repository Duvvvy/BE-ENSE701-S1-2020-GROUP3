var express = require("express");
var router = express.Router();


const pg = require('pg');
const {Pool} = require('pg');

var searchResult;

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
  connectDatabase();
  res.render("articlesearch", { title: "Article search page" });

});

//Route to return articles from DB 
router.post("/search", async (req, res) => {
  //res.send("Looking for article...");
  search(req.body.articleText, res).then(() => approvedSearch(req.body.approvedfilter)).then(() => done(res));
});


/*Connect to database*/
function connectDatabase() {
  pool.connect(function(err) {
    if(err) {
      console.log("Can not connect to the DB" + err);
    }
    else{
      console.log("connected to database");
    }
  }) 
}


var firstResult;
var filteredResult;

function done(res) {
  return new Promise(resolve => {
    if(searchResult == null)
    {
      res.send("nothing found");
    }
    else{
      res.send(searchResult);
    }
    
    resolve();
  })
}

function search(req, res) {
  return new Promise(resolve => {
    var searchArticle = req.toLowerCase();
    console.log("Article to search: " + searchArticle);
    pool.query("SELECT * FROM bibliographicreference WHERE LOWER (bibliographicreference.title) LIKE '%" + searchArticle + "%'" + "OR LOWER (bibliographicreference.article) LIKE '%" + searchArticle + "%'", function(err, result) {
      if(err)
      {
        console.log(err);
        res.send("ERROR In Database");
      }
      else
      {
        firstResult = result;
        resolve();
      }
    });
  });
}

function approvedSearch(approvedfilter) {
  return new Promise(resolve => {
    var articlesFound = null;
    var approved = "awaiting to be approved"
    if(approvedfilter == "on"){
      approved = "approved";
    }
    if(firstResult.rowCount >= 1) {
        for (let row of firstResult.rows) {
          pool.query("SELECT * FROM articlestatus WHERE id='"+ row.id + "' AND LOWER(articlestatus.statusdescription) ='" + approved + "'" , function(err, result) {
            if(err)
            {
              console.log(err);
            }
            else if(result.rowCount >= 1)
            {
              // console.log("Fits Filter: true");
              // console.log("added to JSON");
              articlesFound += JSON.stringify(row)
            }
          });
          // console.log("Approved Filter: " + isApproved);
          // console.log("is approved filter on (undefined means no): " + approvedfilter);
          // console.log("looking at article: " + row);
        }
      setTimeout(() => {searchResult = articlesFound;}, 1000);
      setTimeout(() => {resolve();}, 2000);
    }
  });
}

module.exports = router;
