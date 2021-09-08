require("dotenv").config();
const express = require("express");
const app = express();
require("./config/mongoose");
const bodyParser = require("body-parser");
const auth = require("./auth/auth-resource");
const authenticate = require("./auth/authenticate");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/auth", auth);

app.get("/", (req, res) => res.send("Server is up"));

app.get("/secured", authenticate, (req, res) => {
  res.send("Secured route works!");
});

app.listen(8080, () => console.log("listening on 8080...."));
