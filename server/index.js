const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectToDB = require("./db.js");
const router = require("./routes/index.js");
const userRouter = require("./routes/users.js");
const path = require("path");
dotenv.config();
const app = express();
connectToDB();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/books", router);
app.use("/users", userRouter);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));;

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    )
  );;
} else {
  app.get("/", (req, res) => res.send("Please set to production"));;
}
app.listen(process.env.PORT || 5000, () => {
  console.log("Server listening to port 5000");
});
