/** Express app for bookstore. */


const express = require("express");
const app = express();
const ExpressError = require("./expressError")
app.use(express.json());


const bookRoutes = require("./routes/books");

app.use("/books", bookRoutes);

/** 404 handler */

app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});


/** general error handler */

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(response);
  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
