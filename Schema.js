const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: String,
  // date: Date.now,
  owner: String,
});

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  username: String,
  email: String,
  password: String,
});

module.exports.userSchema = userSchema;
module.exports.postSchema = postSchema;
