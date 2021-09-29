require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./config/mongoose");
const bodyParser = require("body-parser");
const currencies = require("./currencies/currencies-resource");
const auth = require("./auth/auth-resource");
const account = require("./budget/account-resource");

const devUtils = require("./dev/dev-utils");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// TODO: config cors for client app
app.use(cors());
app.use("/api/currencies", currencies);
app.use("/api/auth", auth);
app.use("/api/account", account);

app.listen(8080, async () => {
  console.log("Server is up...");

  const newUser = {
    email: "test@sample.com",
    password: "secret",
  };

  const userId = (await devUtils.createUser(newUser))._id;

  const accountsData = {
    owner: userId,
    accounts: [
      {
        name: "Main",
        ammount: 4500,
        currencyCode: "USD",
      },
      {
        name: "Savings",
        ammount: 50000,
        currencyCode: "USD",
      },
      {
        name: "Rainy days cash",
        ammount: 7000,
        currencyCode: "USD",
      },
    ],
  };

  devUtils.createAccounts(accountsData);
});
