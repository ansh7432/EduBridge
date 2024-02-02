const mongoose = require("mongoose");
// const { String } = require("mongoose/lib/error/messages");
const validator = require("validator");
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "MUST"],
  },
  roll: {
    type: String,
    required: [true, "MUST"],
  },
  course: {
    type: String,
    required: [true, "MUST"],
  },
});

const studentModel = mongoose.model("studentModel", studentSchema);

module.exports = studentModel;
