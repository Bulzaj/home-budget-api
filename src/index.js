require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./config/mongoose");
const bodyParser = require("body-parser");
const currencies = require("./currencies/currencies-resource");
const auth = require("./auth/auth-resource");
const budget = require("./budget/budget-resource");
const authenticate = require("./auth/authenticate");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// TODO: config cors for client app
app.use(cors());
app.use("/api/currencies", currencies);
app.use("/api/auth", auth);
app.use("/api/budget", budget);

app.get("/", (req, res) => res.send("Server is up"));

app.get("/secured", authenticate, (req, res) => {
  res.send("Secured route works!");
});

app.listen(8080, () => console.log("listening on 8080...."));
