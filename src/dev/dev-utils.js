const mongoose = require("mongoose");
const User = require("../auth/user-model");
const Accounts = require("../budget/accounts-model");

const dropCollection = async function (collection) {
  console.log(`drop collection: ${collection}`);

  try {
    await mongoose.connection.db.dropCollection(collection);
  } catch (err) {
    console.log(`Collection ${collection} does not exists`);
  }
};

const createUser = async function (userData) {
  console.log("Create test user...");

  if (await User.findOne({ email: userData.email })) {
    return await User.findOne({ email: userData.email });
  } else {
    return await new User(userData).save();
  }
};

const createAccounts = async function (accountsData) {
  dropCollection("accounts");
  console.log(`Create new accounts for user ${accountsData.owner}`);

  if (await Accounts.findOne({ owner: accountsData.owner })) {
    return await Accounts.findOne({ owner: accountsData.owner });
  } else {
    return await new Accounts(accountsData).save();
  }
};

module.exports = {
  dropCollection,
  createUser,
  createAccounts,
};
