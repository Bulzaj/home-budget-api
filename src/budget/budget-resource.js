const router = require("express").Router();
const authenticate = require("../auth/authenticate");
const Budget = require("./budget-model");
const Account = require("./account-model");

router.get("/", authenticate, async (req, res) => {
  const budget = await Budget.findOne({ owner: req.user.id });
  if (!budget) res.status(404).send("Budget does not exists");
  res.status(200).json(budget);
});

router.get("/accounts", authenticate, async (req, res) => {
  console.log("/accounts runs");
  const accounts = await Budget.findOne({ owner: req.user.id }).populate(
    "accounts"
  );

  res.status(200).json(accounts);
});

router.post("/", authenticate, async (req, res) => {
  if (!req.user.id) res.status(403).send("No user id provided");
  if (!req.body.accounts) res.status(403).send("No accounts provided");

  const budget = new Budget({ owner: req.user.id });

  req.body.accounts.forEach(async function (acc) {
    const account = new Account(acc);
    const result = await account.save();
    budget.accounts.push(result._id);
  });

  try {
    const result = await budget.save();
    res.status(200).json(await budget.save());
  } catch (err) {
    res.status(409).send(err.message);
  }
});

module.exports = router;
