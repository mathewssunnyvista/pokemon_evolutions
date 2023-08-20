// const fs = require("fs/promises");
const express = require("express");
// const cors = require("cors");
// const _ = require("lodash");
// const { v4: uuid } = require("uuid");
const axios = require("axios");
const dotenv = require("dotenv").config();

const app = express();
const EXTERNAL_API_BASE_URL = process.env.EXTERNAL_API_BASE_URL;

// const fetchEvoutionData = async (id) => {
//   const url = `${EXTERNAL_API_BASE_URL}/evolution-chain/${id}`;
//   const response = await fetchData(url);

//   return response;
// };

// app.get(`/evolutionChain1/:id`, async (req, res) => {
//   const data = await fetchEvoutionData(req.params.id);
//   res.json(data);
// });

const Routes = require("./Routes");
app.use("/", Routes);

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
