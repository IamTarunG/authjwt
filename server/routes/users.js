const express = require("express");
const userRouter = express.Router();
const { signUpUser, loginUser, getMe } = require("../controllers/users.js");
const protect = require("../middleware/auth.js");
userRouter.post("/signup", signUpUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", protect, getMe);
module.exports = userRouter;
