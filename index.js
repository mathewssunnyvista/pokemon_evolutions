const express = require("express");
const createError = require("http-errors");
const dotenv = require("dotenv").config();

const app = express();
const Routes = require("./Routes");

app.use("/pokemon_evolutions/api/v1/", Routes);

//404 handler and pass to error handler
app.use((req, res, next) => {
  next(createError(404, "Not found"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`API Server is running`));
