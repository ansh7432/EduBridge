const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const app = express();
const student = require("../controllers/createStudentController");
const { homePage } = require("../controllers/root");
const User = require("../models/userModel");
const {
  userAuth,
  login,
  getUsers,
  protect,
  restrictTo,
  resetPassword,
  forgotPassword
} = require("../controllers/userAuthConroller");
const { reset } = require("nodemon");

router.route("/create/student").post(student.createStudent);
router.route("/get/student").get(protect, student.getStudent);
router.route("/get/student/:id").get(student.getStudentbyID);
router.route("/delete/student/:id").delete(protect,restrictTo('admin'),student.deleteStudentbyID);

router.route("/signup").post(userAuth);
router.route("/login").post(login);
router.route("/getuser").get(protect, getUsers);
router.route('/resetPassword/:token').patch(resetPassword)
router.route('/forgotPassword/:token').patch(forgotPassword)

router.route("/").get(homePage);
module.exports = router;
