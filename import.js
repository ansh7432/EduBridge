const mongoose = require('mongoose');
const fs = require("fs");
const model = require("./models/model");
const dataStudent = require("./dev-data/student-data.json");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
const database = process.env.DATABASE_LOCAL;

mongoose
  .connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DATABASE SUCCESSFULLY CONNECTED"));

const data = JSON.parse(
  fs.readFileSync(`${__dirname}/student_roll.json`, "utf-8")
);

const importData = async () => {
  try {
    await model.create(data);
    console.log("Data Successfully IMPORTED");
    // importData();
  } catch (err) {
    console.log(err);
  }
};
const deleteData = async () => {
  try {
    await model.deleteMany();
    console.log("Deleted Successfully");
    
  } catch (err) {
    console.log(err);
  }
};
// deleteData()
importData()
console.log(process.argv);