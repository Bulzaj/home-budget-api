const router = require("express").Router();
const authenticate = require("../auth/authenticate");
const { populate } = require("./accounts-model");
const Accounts = require("./accounts-model");
const AccountAction = require("./account-action-model");

// get all user accounts
router.get("/", authenticate, async (req, res) => {
  const result = await Accounts.find({ owner: req.user.id });
  if (result.length === 0)
    res.status(404).json({ message: "Accounts does not found" });
  res.status(200).json(result);
});

// get history of specyfic account
router.get("/:id/history", authenticate, async (req, res) => {
  const accountId = req.params.id;
  const { accounts } = await Accounts.findOne({ owner: req.user.id });

  try {
    const account = accounts.id(accountId);
    const operations = await fetchOperationsHistory(account.operationsHistory);
    res.status(200).json(operations);
  } catch (err) {
    res.status(404).send(`Account with id ${accountId} does not exists`);
  }
});

const fetchOperationsHistory = async (operations) => {
  return Promise.all(
    await operations.map(async (operation) => {
      const result = await AccountAction.findById(operation);
      return result;
    })
  );
};

module.exports = router;
