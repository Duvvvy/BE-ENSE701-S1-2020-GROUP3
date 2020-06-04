const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
/* POST login. */

const { Pool } = require("pg");
let conString =
  process.env.DATABASE_URL ||
  "postgres://ptoxwxykmkqxkj:c4ce46ef9bdc80563e1d4b90fb65b48a7829e42a07b526c5f8c05cb6fc17bcf2@ec2-35-153-12-59.compute-1.amazonaws.com:5432/ddp53njp2q9370";
const pool = new Pool({
  connectionString: conString,
  ssl: {
    rejectUnauthorized: false,
  },
});
/*
router.get("/join", function (req, res, next) {
  res.render("join", {
    title: "Join",
    messages: {
      danger: req.flash("danger"),
      warning: req.flash("warning"),
      success: req.flash("success"),
    },
  });
});
*/

router.post("/join", async function (req, res) {
  try {
    const client = await pool.connect();
    await client.query("BEGIN");
    client.query(
      `SELECT id FROM "User" WHERE email='${req.body.email}'`,
      function (err, result) {
        if (result.rows[0]) {
          res
            .status(500)
            .json({ response: "This email address is already registered." });
        } else {
          client.query(
            `INSERT INTO "User" (username, email, password) VALUES ('${req.body.email}', '${req.body.email}', '${req.body.password}')`,
            function (err, result) {
              if (err) {
                res
                  .status(500)
                  .json({ response: "User failed to commit to database." });
              } else {
                client.query("COMMIT");
                console.log(result);
                res.status(200).json({
                  response: `User created with email ${req.body.email}.`,
                });
                return;
              }
            }
          );
        }
      }
    );
    client.release();
  } catch (e) {
    throw e;
  }
});

module.exports = router;
