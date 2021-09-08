const mongoose = require("mongoose");

const mongodbUrl = "mongodb://127.0.0.1:27017/home-budget";

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
};

mongoose.connect(mongodbUrl, options);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));

db.on("open", () => console.log("connected"));

mongoose.connect(mongodbUrl, options);
