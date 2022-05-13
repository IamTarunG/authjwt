const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel.js");

const signUpUser = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userExist = await User.findOne({ email: email });
    if (!email || !password || !name) {
      res.status(400).json({ message: "Please all fileds" });
    }
    if (userExist) {
      res.status(400).json({ message: "User already exists" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      if (user) {
        res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToke(user._id),
        });
      }
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToke(user._id),
      });
    } else {
      res.status(400).json({ message: "Not correct user" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});
const generateToke = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: "30d" });
};
module.exports = {
  signUpUser,
  loginUser,
  getMe,
};
