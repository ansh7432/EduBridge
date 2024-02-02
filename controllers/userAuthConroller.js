const User = require("../models/userModel");
const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const tokenAuth = (el) => {
  return jwt.sign({ el }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const correctPassword = require("./../models/userModel");
const sendEmail = require("./../utills/email");
const { reset } = require("nodemon");

exports.userAuth = async (req, res) => {
  try {
    const newUser = await User.create({
      Name: req.body.Name,
      Email: req.body.Email,
      Role: req.body.Role,
      Photo: req.body.Photo,
      Password: req.body.Password,
      PasswordConfirm: req.body.PasswordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
      passwordResetToken,
      passwordResetExpires,
    });
    const token = tokenAuth(newUser._id);

    res.status(201).json({
      success: true,
      token,
      data: newUser,
    });
    console.log(newUser);
  } catch (err) {
    res.status(400).json({
      message: err,
    });
    console.log(err);
  }
};
exports.getUsers = async (req, res, next) => {
  try {
    const getUser = await User.find();
    res.status(201).json({
      message: getUser,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return res.status(400).json({ message: "Enter the details correctly" });
    }
    const userEntered = await User.findOne({ Email }).select("+Password");

    if (
      !userEntered ||
      !(await userEntered.correctPassword(Password, userEntered.Password))
    ) {
      return next(console.log("Check the details"));
    }
    const token = tokenAuth(userEntered._id);
    res.status(200).json({
      status: "Success",
      token,
    });
  } catch (err) {
    res.json({
      err: { err },
    });
    console.log(err);
  }
  // console.log(req.headers);
};

exports.protect = async (req, res, next) => {
  let token;
  //Getting the token and check if it is there or not...
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log(token);
  if (!token) {
    return next("You are not logged in");
  }
  // Validate the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  //  check if user still exist
  const currentUser = await User.findById(decoded.el);
  if (!currentUser) {
    return next("Token Wrong");
  }

  currentUser.changedPasswordAfter(decoded.iat);
  // user changed password

  req.User = currentUser;
  next();
};
exports.restrictTo = (...Roles) => {
  return (req, res, next) => {
    if (!Roles.includes(req.User.Role)) {
      return console.log("You are not authorized to delete");
    }
    next();
  };
};
exports.resetPassword = async (req, res, next) => {
  const user = await User.findOne({ Email: req.body.Email });
  if (!user) {
    next("There is no user");
  }
  const resetToken = user.resetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/resetPassword/${resetToken}`;

  const message = `Forgot Your Password Here is your reset url:${resetUrl} `;
  try {
    await sendEmail({
      Email: user.Email,
      subject: "Your Reset Password Token is here",
      message,
    });

    res.status(200).json({
      status: "SUccessfully Sent the email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next("There was an error ");
  }
};

exports.forgotPassword = async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next("Token invalid or expired");
  }
  user.Password = req.body.Password;
  user.PasswordConfirm = req.body.PasswordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = tokenAuth(user._id);
  res.status(200).json({
    status: "Success",
    token,
  });
};
