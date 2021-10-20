const mongoose = require("mongoose");
const User = require("../auth/user-model");
const Accounts = require("../budget/accounts-model");
const AccountAction = require("../budget/account-action-model");

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
  // dropCollection("accounts");
  console.log(`Create new accounts for user ${accountsData.owner}`);

  if (await Accounts.findOne({ owner: accountsData.owner })) {
    return await Accounts.findOne({ owner: accountsData.owner });
  } else {
    return await new Accounts(accountsData).save();
  }
};

const addAccountHistory = async function (ownerId, account, historyData) {
  if (!account) throw new Error("No account provided");
  console.log(`Add history to account: ${account.name}`);

  const actionIds = await saveAccountActions(historyData);
  account.operationsHistory = actionIds;

  if (!ownerId) throw new Error("No accounts ower id provided");

  const accounts = await Accounts.findOne({ owner: ownerId });
  accounts.accounts
    .filter((acc) => {
      return acc._id.equals(account._id);
    })
    .map((acc) => (acc.operationsHistory = account.operationsHistory));

  await accounts.save();
};

const saveAccountActions = async (historyData) => {
  return Promise.all(
    historyData.map(async (action) => {
      const result = await new AccountAction(action).save();
      return result._id;
    })
  );
};

const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports = {
  dropCollection,
  createUser,
  createAccounts,
  addAccountHistory,
  randomDate,
  randomInt,
};
