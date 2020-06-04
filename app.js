var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var testAPIRouter = require("./testAPI");
var searchArticleRouter = require("./routes/articlesearch");
var signupRouter = require("./routes/signup");
var cors = require("cors");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/testAPI", testAPIRouter);
app.use("/articlesearch", searchArticleRouter);
app.use("/signup", signupRouter)

/*  PASSPORT SETUP  */

const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

/* PASSPORT LOCAL AUTHENTICATION */

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'pass'
},
(username, password, done) => {
  log.debug("Login process:", username);
  return db.one("SELECT user_id, user_name, user_email, user_role " +
      "FROM users " +
      "WHERE user_email=$1 AND user_pass=$2", [username, password])
    .then((result)=> {
      return done(null, result);
    })
    .catch((err) => {
      log.error("/login: " + err);
      return done(null, false, {message:'Wrong user name or password'});
    });
}));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//Notes
console.log("http://localhost:9000");
console.log("Ctrl + C to stop");

module.exports = app;
