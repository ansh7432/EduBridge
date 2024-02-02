const model = require("../models/model");

exports.createStudent = async (req, res) => {
  try {
    const newStudent = await model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        student: newStudent,
      },
    });
    console.log(newStudent);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
    console.log(err);
  }
};
exports.getStudent = async (req, res) => {
  try {
    const getStudent = await model.find();
    res.status(201).json({
      status: "Successfully Fetched Data",
      data: {
        students: getStudent,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
    });
    console.log(err);
  }
};
exports.getStudentbyID = async (req, res) => {
  try {
    const getStudentId = await model.findById(req.params.id);
    res.status(201).json({
      status: "Here is the Student Data",
      data: {
        student: getStudentId,
      },
    });
    console.log("Done");
  } catch (err) {
    res.status(400).json({
      status: "Fail",
    });
    console.log(err);
  }
};
exports.deleteStudentbyID = async (req, res) => {
  try {
    const deleteStudent = await model.findByIdAndDelete(req.params.id);
    res.status(201).json({
      status: "DELETED SUCCESSFULLY",
    });
    console.log("Done");
  } catch (err) {
    res.status(400).json({
      status: "Fail",
    });
    console.log(err);
  }
};