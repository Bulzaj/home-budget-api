const mongoose = require("mongoose");
const User = require("../auth/user-model");
const Account = require("../account/account-model");
const Operation = require("../history/operation-model");

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
  await dropCollection("accounts");
  console.log(`Create new accounts:`);

  if (!accountsData.length) {
    console.log("No accounts data provided");
    return;
  }

  const resultArr = Promise.all(
    accountsData.map(async (account) => {
      const result = await new Account(account).save();
      console.log(` --${result.name} ${result._id}`);
      return result;
    })
  );

  return resultArr;
};

const createOperations = async (historyData) => {
  await dropCollection("operations");
  console.log(`Create operations history `);
  historyData.forEach((data) => {
    return Promise.all(
      data.map(async (operation) => {
        const result = await new Operation(operation).save();
        return result._id;
      })
    );
  });
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
  createOperations,
  randomDate,
  randomInt,
};
