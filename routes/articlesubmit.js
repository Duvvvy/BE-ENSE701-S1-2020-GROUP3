var express = require("express");
var router = express.Router();

const { Pool } = require("pg");
let theId;
let articleStatusId;
let articleId;

/* Create new pool*/
let conString =
  process.env.DATABASE_URL ||
  "postgres://avrxayow:WsRhIGQ6XcW_MGdgDP47y8udjUnPUpiD@rosie.db.elephantsql.com:5432/avrxayow";
const pool = new Pool({
  connectionString: conString,
  ssl: {
    rejectUnauthorized: false,
  },
});

router.post("/submitarticle", async (req, res) => {
  var data = req.body;
  var wasError = false;

  await insertReference(data).catch((error) => {
    console.log(error);
    res.statusCode = 500;
    res.send({ ResponseText: error });
    wasError = true;
  });

  console.log(
    "Pool count:" + pool.totalCount + " Waiting count:" + pool.waitingCount
  );

  console.log("insert done with id " + theId);
  if (!wasError) {
    await getArticleStatus("New").catch((error) => {
      console.log(error);
      res.statusCode = 500;
      wasError = true;
      res.send({ ResponseText: error });
    });
  }

  console.log(
    "Pool count:" + pool.totalCount + " Waiting count:" + pool.waitingCount
  );

  if (!wasError) {
    await insertArticle(articleStatusId, theBibId, data.userId).catch(
      (error) => {
        console.log(articleStatusId + ":" + theBibId + ":" + data.userId);
        console.log(error);
        res.statusCode = 500;
        wasError = true;
        res.send({ ResponseText: error });
      }
    );
  }

  console.log(
    "Pool count:" + pool.totalCount + " Waiting count:" + pool.waitingCount
  );

  if (!wasError) res.send({ ResponseText: articleId });
});

async function insertReference(data) {
  console.log(data);
  let promise = await new Promise((resolve, reject) => {
    setTimeout(() => reject("Timeout"), 10000);
    pool.connect((err, client, release) => {
      if (err) {
        reject(err.message);
      }
      client
        .query(
          `insert into bibliographicreference  (article , author, title, journal, journalYear, journalVolume, journalNumber, pagesFrom, pagesTo, journalMonth ) values ('${data.article}','${data.author}','${data.title}','${data.journal}','${data.year}','${data.volume}','${data.number}','${data.pagefrom}','${data.pageto}','${data.month}' ) RETURNING id`
        )
        .then((res) => {
          theBibId = res.rows[0].id;
          resolve();
        })
        .catch((err) => reject(err.message))
        .then(() => client.release());
    });
  });
}

async function getArticleStatus(statusText) {
  let promise = await new Promise((resolve, reject) => {
    setTimeout(() => reject("Timeout"), 10000);
    pool.connect((err, client, release) => {
      if (err) {
        reject(err.message);
      }

      client
        .query(
          "select id from articlestatus where statusDescription = '" +
            statusText +
            "'"
        )
        .then((res) => {
          console.log("article status id: " + res.rows[0].id);
          articleStatusId = res.rows[0].id;
          resolve();
        })
        .catch((err) => reject(err.message))
        .then(() => client.release());
    });
  });
}

async function insertArticle(theStatus, theBibId, theUser) {
  let promise = await new Promise((resolve, reject) => {
    setTimeout(() => reject("Timeout"), 10000);
    pool.connect((err, client, release) => {
      if (err) {
        reject(err.message);
      }
      client
        .query(
          `insert into Article(status , bibliographicReferenceId, userSubmitted) values (${theStatus}, ${theBibId}, ${theUser}) RETURNING id`
        )
        .then((res) => {
          console.log("article id: " + res.rows[0].id);
          articleId = res.rows[0].id;
          resolve();
        })
        .catch((err) => reject(err.message))
        .then(() => client.release());
    });
  });
}

module.exports = router;
