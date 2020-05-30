var express = require("express");
var router = express.Router();

const {Pool} = require('pg');

var searchResult;

/* Create new pool*/
let conString = process.env.DATABASE_URL || 'postgres://ptoxwxykmkqxkj:c4ce46ef9bdc80563e1d4b90fb65b48a7829e42a07b526c5f8c05cb6fc17bcf2@ec2-35-153-12-59.compute-1.amazonaws.com:5432/ddp53njp2q9370';
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
router.post("/search", async (req, res) => {
  // var value = req.body.value;
  // var field = req.body.field;
  // var operator = req.body.operator;
  // var dateFrom = req.body.dateFrom;
  // var dateTo = req.body.dateTo;

  var field = "title";

  // var field = "method";
  var operator = "contains";
  var value = req.body.articleText;
  var dateFrom = new Date(2000, 02, 01);
  var dateTo = new Date(2020, 05, 29);
  var wasError = false;

  field = field.toLowerCase();
  operator = operator.toLowerCase();
  value = value.toLowerCase();

  let data = [field, operator, value, dateFrom, dateTo];

  await search(data).catch((error) => {
    console.log("Error: " + error);
    res.statusCode = 500;
    res.send({ResponseText: error});
    wasError = true;
  }).then(() => done(res));
});

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

async function search(data) {
  console.log(data);
  let promise = await new Promise((resolve, reject) => {
    setTimeout(() => reject("Timeout"), 10000);
    if(data[0] == "article" || data[0] == "author" || data[0] == "title" || data[0] == "journal" || data[0] == "journalvolume" || data[0] == "journalnumber" || data[0] == "pagesfrom" || data[0] == "pagesto")
    {
      console.log("searchingBib");
      searchBibliographicReference(data).then(() => {
        resolve();
      });
    }
    else if(data[0] == "method" ) {
      searchMethod(data).then(() => {
        resolve();
      });
    }
  }); 
}

async function checkDate(result, data) {
  let promise = await new Promise((resolve, reject) => {
    setTimeout(() => reject("Timeout"), 10000);
    if(result.rowCount >= 1) {
      for(let row of result.rows) {
        console.log("rows: " + JSON.stringify(row));
        if(row.journalyear >= data[3].getFullYear() && row.journalyear <= data[4].getFullYear()) {
          var date = new Date(row.journalyear, row.journalmonth, 0);
          if(row.journalmonth != null) {
            if((date >= data[3] && date <= data[4])) {
              console.log("ADDED");
              searchResult += JSON.stringify(row)
            }
          }
        }
      }
    }
    resolve();
  })
}

async function searchMethod(data) {
  let promise = await new Promise((resolve, reject) => {
    setTimeout(() => reject("Timeout"), 10000);
    let query;
    switch(data[1]) {
      case 'contains' :
        query = "SELECT articleid FROM articleevidence WHERE LOWER (articleevidence.evidencemethod) LIKE '%" + data[2] + "%'";
        break;
      
      case 'does not contain':
        query = "SELECT articleid FROM articleevidence WHERE LOWER (articleevidence.evidencemethod) NOT LIKE '%" + data[2] + "%'";
        break;
     
      case 'begins with':
        query = "SELECT articleid FROM articleevidence WHERE LOWER (articleevidence.evidencemethod) LIKE '" + data[2] + "%'";
        break;

      case 'ends with':
        query = "SELECT articleid FROM articleevidence WHERE LOWER (articleevidence.evidencemethod) LIKE '%" + data[2] + "'";
        break;   

      case 'is equal to' :
        query = "SELECT articleid FROM articleevidence WHERE LOWER (articleevidence.evidencemethod) LIKE '%" + data[2] + "%'";
        break;  
    }

    pool.connect((err, cilent, release) => {
      if(err) {
        reject(err.message);
      }
      cilent.query(query)
      .then((resultID) => {
        console.log("Finding Article with Id")
        findArticle(cilent, resultID, data)
        .then(() => {
        resolve();
        })
        .catch((err) => reject(err.message))
      })
      .then(() => cilent.release());
    });    
  })
}

async function findArticle(cilent, resultID, data) {
  let promise = await new Promise((resolve, reject) => {
    setTimeout(() => reject("Timeout"), 10000);
    if(resultID.rowCount >= 1) {
      for(let row of resultID.rows) {
        console.log("rows: " + JSON.stringify(row));
        console.log("articleID: " + row.articleid);
        cilent.query("SELECT * FROM bibliographicreference WHERE id=" + row.articleid)
        .then((result) => {
          checkDate(result, data)
        })
        .then(() => {
          resolve();
        })
      }
    }
  })
}

async function searchBibliographicReference(data) {
  let promise = await new Promise((resolve, reject) => {
    setTimeout(() => reject("Timeout"), 10000);
    let query;
    switch(data[1]) {
      case 'contains':
        query = "SELECT * FROM bibliographicreference WHERE LOWER (bibliographicreference." + data[0] + ") LIKE '%" + data[2] + "%'";
        break;

      case 'does not contain':
        query = "SELECT * FROM bibliographicreference WHERE LOWER (bibliographicreference." + data[0] + ") NOT LIKE '%" + data[2] + "%'";
        break;

      case 'begins with':
        query = "SELECT * FROM bibliographicreference WHERE LOWER (bibliographicreference." + data[0] + ") LIKE '" + data[2] + "%'";
        break;

      case 'begins with':
        query = "SELECT * FROM bibliographicreference WHERE LOWER (bibliographicreference." + data[0] + ") LIKE '%" + data[2] + "'";
        break;  

      case 'is equal to':
        query = "SELECT * FROM bibliographicreference WHERE LOWER (bibliographicreference." + data[0] + ")='" + data[2] + "'";
        break;    
    }

    pool.connect((err, cilent, release) => {
      if(err) {
        reject(err.message);
      }
      cilent.query(query)
      .then((result) => {
        console.log("Checking Date")
        checkDate(result, data)
        .then(() => {
          resolve();
        })
        .catch((err) => reject(err.message))
      }).then(() => cilent.release());
    });
  });
}

module.exports = router;
