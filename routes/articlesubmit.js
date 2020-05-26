var express = require("express");
var router = express.Router();

const { Client } = require("pg");

/* Create new pool*/
let conString =
  process.env.DATABASE_URL ||
  "postgres://mjlrcdotwouger:9234e9e5235b549e9389d1aab578a2c144306c4ab61b1acd052dfb87ffc645c1@ec2-35-174-127-63.compute-1.amazonaws.com:5432/da9rg6k174929g";
const client = new Client({
  connectionString: conString,
  ssl: {
    rejectUnauthorized: false,
  },
});

function connectDatabase() {
  client.connect(function (err) {
    if (err) {
      console.log("Can not connect to the DB" + err);
    } else {
      console.log("connected to database");
    }
  });
}

router.post("/submitarticle", async (req, res) => {
  var data = req.body;
  connectDatabase();
  insertReference(data);
});

function insertReference(data) {
  console.log(data);
  client
    .query(
      "insert into bibliographicreference  (article , author, title, journal, journalYear, journalVolume, journalNumber, pagesFrom, pagesTo, journalMonth ) values ('" +
        data.article +
        "','" +
        data.author +
        "','" +
        data.title +
        "','" +
        data.journal +
        "','" +
        data.year +
        "','" +
        data.volume +
        "','" +
        data.number +
        "','" +
        data.pagefrom +
        "','" +
        data.pageto +
        "','" +
        data.month +
        "' ) RETURNING id"
    )
    .then((res) => {
      var returnedId = res.rows[0].id;
      //call insertArticle, need to figure out the user aspect first.
    })
    .catch(
      (err) =>
        function (err) {
          console.log(err.stack);
          //do some stuff to return error to client.
        }
    );
}

function insertArticle(data) {
  statusId = getArticleStatus("New");
  client
    .query(
      "insert into Article(status , bibliographicReferenceId, userSubmitted) (" +
        statusId +
        ", '" +
        data.id +
        "' , " +
        data.userId +
        ")"
    )
    .then(console.log(res.rows[0].id))
    .catch(
      (err) =>
        function (err) {
          console.log(err.stack);
          res.err;
          //do some stuff to return error to client.
        }
    );
}

function getArticleStatus(statusText) {
  client
    .query(
      "select id from articlestatus where statusDescription = '" +
        statusText +
        "'"
    )
    .then(console.log(res.rows[0].id))
    .catch(
      (err) =>
        function (err) {
          console.log(err.stack);
          res.err;
          //do some stuff to return error to client.
        }
    );
}

module.exports = router;
