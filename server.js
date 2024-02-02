const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const app = express();
const client = require("./app");
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
const database = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DATABASE SUCCESSFULLY CONNECTED"));

const port = process.env.port || 8000;
client.listen(port, () => {
  console.log({port}, "working");
});
