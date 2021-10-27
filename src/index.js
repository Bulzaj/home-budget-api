require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./config/mongoose");
const bodyParser = require("body-parser");

const currencies = require("./currencies/currencies-resource");
const auth = require("./auth/auth-resource");
const account = require("./account/account-resource");
const history = require("./history/history-resource");
const spec = require("./specification/specification-resource");

const devUtils = require("./dev/dev-utils");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// TODO: config cors for client app
app.use(cors());
app.use("/api/currencies", currencies);
app.use("/api/auth", auth);
app.use("/api/account", account);
app.use("/api/history", history);
app.use("/api/spec", spec);

app.listen(8080, async () => {
  console.log("Server is up...");

  // Creating user
  const newUser = {
    email: "test@sample.com",
    password: "secret",
  };

  const userId = (await devUtils.createUser(newUser))._id;

  // Creating user accounts
  const accountsData = [
    {
      owner: userId,
      name: "Main",
      ammount: 4500,
      currencyCode: "USD",
    },
    {
      owner: userId,
      name: "Savings",
      ammount: 50000,
      currencyCode: "EUR",
    },
    {
      owner: userId,
      name: "Rainy days cash",
      ammount: 7000,
      currencyCode: "USD",
    },
    {
      owner: userId,
      name: "Test account",
      ammount: 6874.2,
      currencyCode: "PLN",
    },
  ];

  const accounts = await devUtils.createAccounts(accountsData);

  // Create accounts history
  const mainAccountHistory = [
    {
      type: "INCOME",
      ammount: 4800,
      description: "payday :)",
      category: "SALARY",
      account: accounts[0]._id,
      currentBalance: 8500,
    },
    {
      type: "EXPENDITURE",
      ammount: 38,
      description: "new pair of shoes",
      category: "CLOTHES",
      account: accounts[0]._id,
      currentBalance: 8462,
    },
    {
      type: "EXPENDITURE",
      ammount: 300,
      description: "traffic ticket :(",
      category: "TAX AND ADMINISTRATION",
      account: accounts[0]._id,
      currentBalance: 8162,
    },
  ];

  const savingsAccountHistory = [
    {
      type: "INCOME",
      ammount: 7000,
      description: "for darkest hour",
      category: "TOP UP",
      account: accounts[1]._id,
      currentBalance: 14000,
    },
    {
      type: "EXPENDITURE",
      ammount: 1300,
      description: "new tv",
      category: "CONSUMER ELECTRONICS",
      account: accounts[1]._id,
      currentBalance: 12700,
    },
  ];

  const testAccountHistory = [];
  const testAccountStartBalance = 30000;
  testAccountHistory.push({
    type: "INCOME",
    ammount: 7000,
    description: "test desc 1",
    category: "TOP UP",
    account: accounts[3]._id,
    currentBalance: 21300,
  });

  for (let i = 0; i <= 20; i++) {
    const operationAmmount = devUtils.randomInt(20, 5000);
    testAccountHistory.push({
      type: "EXPENDITURE",
      ammount: operationAmmount,
      description: `test description ${i}`,
      category: "CONSUMER ELECTRONICS",
      createdAt: devUtils.randomDate(new Date(2018, 3, 21), new Date()),
      account: accounts[3]._id,
      currentBalance: testAccountStartBalance - operationAmmount,
    });
  }

  await devUtils.createOperations([
    mainAccountHistory,
    savingsAccountHistory,
    testAccountHistory,
  ]);
});
