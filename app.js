var createError = require("http-errors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');

var indexRouter = require("./routes/index");
var searchArticleRouter = require("./routes/articlesearch");
var submitArticleRouter = require("./routes/articlesubmit");

require('./models/Users');

//Is this prod or dev?
const isProduction = process.env.NODE_ENV === 'production';


//Initiate our app
const app = express();

//Configure our app
app.use(cors());
app.use(require('morgan')('dev'));

//TODO CHANGE THE SECRET
app.use(session({ secret: 'secret', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
//TODO CHANGE THE SECRET
if(!isProduction) {
  app.use(errorHandler());
}

// view engine setup
app.set("views", path.join(__dirname, "views"));//Remove?
app.set("view engine", "jade");//Remove?

app.use(require('morgan')('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());//What is this?
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/articlesearch", searchArticleRouter);
app.use("/article", submitArticleRouter);

//Configure Mongoose
mongoose.connect('mongodb://localhost/passport-tutorial');
mongoose.set('debug', true);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//Error handlers & middlewares
if(!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}else{
  app.use((err, req, res) => {
    res.status(err.status || 500);
  
    res.json({
      errors: {
        message: err.message,
        error: {},
      },
    });
  });
}



//Notes
console.log("http://localhost:9000");
console.log("Ctrl + C to stop");


module.exports = app;
