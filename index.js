const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyparser = require("body-parser"); //handle http post request
const multer = require("multer"); //file upload
const mongoose = require("mongoose");
const { userSchema, postSchema } = require("./Schema");
const bcrypt = require("bcrypt");
const saltRounds = 10;

mongoose.set("strictQuery", false);

const app = express();
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true })); //important for collecting post content
app.use(express.static("public"));
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json()); // very important, it allows the app to read the json body

// connection to db
mongoose
  .connect("mongodb://localhost:27017/Howfar")
  .then(() => console.log("DB Connected!"))
  .catch((err) => {
    console.log(err);
  });

const Post = mongoose.model("Post", postSchema);
const User = mongoose.model("User", userSchema);

// const post = new Post({
//   content: "This is a test post",
//   owner: "Nsikan",
// });

// post.save();

app.get("/", (req, res) => {
  res.send("The How far server");
});

app.get("/api", (req, res) => {
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});

app.post("/signup", async (req, res) => {
  let { fname, lname, email, username, password } = req.body;
  User.find({ email: email }, function (err, docs) {
    if (docs[0] == undefined) {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        const user = new User({
          firstname: fname,
          lastname: lname,
          email: email,
          username: username,
          password: hash,
        });
        user.save();
      });
      res.send("Signed up");
      console.log("A user signed up.");
    } else {
      console.log("user exist");
      res.send("user exist");
    }
  });
});

app.post("/signin", async (req, res) => {
  let { email, password } = req.body;
  User.find({ email: email }, function (err, docs) {
    if (docs[0] == undefined) {
      res.send("user does not exist");
    } else {
      if (err) {
        console.log(err);
      } else {
        bcrypt.compare(password, docs[0].password, function (err, result) {
          if (result == true) {
            res.send([{ userid: docs[0]._id, message: "Signing in" }]);
          } else {
            res.send("password is incorrect.");
          }
        });
      }
    }
  });
});

app.post("/reset", async (req, res) => {
  let { email } = req.body;

  console.log(email);
});

app.get("/*", (req, res) => {
  res.send("404 Error");
});

app.listen(5000, () => {
  console.log("server started");
});
