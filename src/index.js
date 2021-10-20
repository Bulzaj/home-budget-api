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

  // Creating user
  const newUser = {
    email: "test@sample.com",
    password: "secret",
  };

  const userId = (await devUtils.createUser(newUser))._id;

  // Creating user accounts
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
        currencyCode: "EUR",
      },
      {
        name: "Rainy days cash",
        ammount: 7000,
        currencyCode: "USD",
      },
      {
        name: "Test account",
        ammount: 6874.2,
        currencyCode: "PLN",
      },
    ],
  };

  const { accounts } = await devUtils.createAccounts(accountsData);

  // Create accounts history
  const mainAccountHistory = [
    {
      type: "INCOME",
      ammount: 4800,
      description: "payday :)",
      category: "SALARY",
    },
    {
      type: "EXPENDITURE",
      ammount: 38,
      description: "new pair of shoes",
      category: "CLOTHES",
    },
    {
      type: "EXPENDITURE",
      ammount: 300,
      description: "traffic ticket :(",
      category: "TAX AND ADMINISTRATION",
    },
  ];

  const savingsAccountHistory = [
    {
      type: "INCOME",
      ammount: 7000,
      description: "for darkest hour",
      category: "TOP UP",
    },
    {
      type: "EXPENDITURE",
      ammount: 1300,
      description: "new tv",
      category: "CONSUMER ELECTRONICS",
    },
  ];

  const testAccountHistory = [];
  testAccountHistory.push({
    type: "INCOME",
    ammount: 7000,
    description: "test desc 1",
    category: "TOP UP",
  });
  for (let i = 0; i <= 20; i++) {
    testAccountHistory.push({
      type: "EXPENDITURE",
      ammount: devUtils.randomInt(20, 5000),
      description: `test description ${i}`,
      category: "CONSUMER ELECTRONICS",
      createdAt: devUtils.randomDate(new Date(2018, 3, 21), new Date()),
    });
  }

  devUtils.dropCollection("accountactions");

  await devUtils.addAccountHistory(userId, accounts[0], mainAccountHistory);
  await devUtils.addAccountHistory(userId, accounts[1], savingsAccountHistory);
  await devUtils.addAccountHistory(userId, accounts[3], testAccountHistory);
});
