const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
validator.enu;
const methods = require("methods");

const userModel = new mongoose.Schema({
  Name: {
    type: String,
    required: [true, "Please tell us your name"],
  },
  Email: {
    type: String,
    required: [true, "Provide Your Email ID"],
    validate: [validator.isEmail, "Please provide valid email address"],
    unique: true,
  },
  // Photo: {
  //   type: String,
  //   required: [true, "Must provide your photo"],
  // },
  Role: {
    type: String,
    enum: ["user", "admin", "viewer"],
    // required: [true, "Please tell us your role"],
    default: "user",
  },
  Password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  PasswordConfirm: {
    type: String,
    required: [true, "Please Confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.Password;
      },
      message: "Please recheck your password",
    },
  },
  passwordChangedAt: {
    Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// instance to hash the password and remove passWord confirm at last;
userModel.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  this.Password = await bcrypt.hash(this.Password, 12); //12 is encryption elel
  this.PasswordConfirm = undefined;
  next();
});

userModel.pre("save", function (next) {
  if (!this.isModified("Password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// method to compare the incoming password with hashed one in database
userModel.methods.correctPassword = async function correctPassword(
  enteredPassword,
  userPassword
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

//if changed password
userModel.methods.changedPasswordAfter = function (JWT) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt();
    // this.passwordChangedAt.getTime() / 1000, 10;
    console.log(changedTimestamp, JWT);
    return JWT < changedTimestamp;
  }

  //if not changed
  return false;
};

// Reset password token generator will be send through email
userModel.methods.resetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userModel);
module.exports = User;
