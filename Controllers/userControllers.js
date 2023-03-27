require("dotenv").config();
const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const { response } = require("express");

function createToken(_id) {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}

//signin controller
async function signin(req, res) {
  const data = req.body;
  try {
    const user = await userModel.signin(data);
    const token = createToken(user._id);
    res.status(200).send({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

//signup controller
async function signup(req, res) {
  const data = req.body;
  try {
    const user = await userModel.signup(data);
    const token = createToken(user._id);
    res.status(201).send({ firstName: user.firstName, token });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

module.exports = { signin, signup };
