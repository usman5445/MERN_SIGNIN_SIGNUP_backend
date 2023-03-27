const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validate = require("validator");
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

//static methods for users
userSchema.statics.signup = async function (data) {
  //validation

  if (!data.email || !data.password || !data.firstName) {
    throw Error("All fields must be Filled.");
  } else if (!validate.isEmail(data.email)) {
    throw Error("Email is not valid.");
  } else if (!validate.isStrongPassword(data.password)) {
    throw Error("Please enter a strong password.");
  }
  const isExist = await this.findOne({ email: data.email });
  if (isExist) throw new Error(`User with email ${data.email} already exists`);

  //generating user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);
  const newUser = await this.create({ ...data, password: hashedPassword });
  return newUser;
};

userSchema.statics.signin = async function (data) {
  //validation
  if (!data.email || !data.password) {
    throw Error("All fields must be Filled.");
  }

  //returning user
  const user = await this.findOne({ email: data.email });
  if (!user) {
    throw Error("User not found! Please check your email.");
  } else if (!(await bcrypt.compare(data.password, user.password))) {
    throw Error("Incorrect password!");
  }

  return user;
};
module.exports = mongoose.model("User", userSchema);
