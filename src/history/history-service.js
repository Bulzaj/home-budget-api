const Account = require("../account/account-model");

const getHistory = async (accountId, from, to, type) => {
  try {
    const account = await Account.findById(accountId);

    const match = {};
    if (from) match.createdAt = { $gte: from };
    if (to) match.createdAt = { $lte: to };
    if (from && to) match.createdAt = { $gte: from, $lte: to };

    if (type) match.type = type;

    await account
      .populate({
        path: "history",
        match,
        options: {
          sort: {
            createdAt: 1,
          },
        },
      })
      .execPopulate();

    return account.history;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  getHistory,
};
