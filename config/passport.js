const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

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

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  "local",
  new LocalStrategy({ passReqToCallback: true }, function (
    req,
    token,
    ok,
    done
  ) {
    loginAttempt();

    async function loginAttempt() {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        var currentAccountsData = await JSON.stringify(
          client.query(
            `SELECT id, username, email, password FROM "User" WHERE "email"='${req.body.email}'`,
            function (err, result) {
              if (err) {
                return done(err);
              } else if (result.rows[0] == null) {
                return done("Oops. Incorrect login details.");
              } else {
                if (result.rows[0].password === req.body.password) {
                  //password match
                  console.log("password match");
                  return done(null, result.rows[0].username, result.rows[0].id);
                } else {
                  return done("Oops. Incorrect login details.");
                }
              }
            }
          )
        );
      } catch (e) {
        throw e;
      }
    }
  })
);
