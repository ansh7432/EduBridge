const express = require("express");

const createStudent = require("./routes/createStudent");
const app = express();
app.use(express.json());
app.use(createStudent);

// app.use((req, res) => {
//   res.send(console.log("Helloo from middleware"));
//   // console.log(req.headers);
// });
module.exports = app;
