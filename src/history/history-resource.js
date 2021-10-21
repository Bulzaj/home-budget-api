const router = require("express").Router();
const authenticate = require("../auth/authenticate");
const Account = require("../account/account-model");

router.get("/:accountId", authenticate, async (req, res) => {
  const accountId = req.params.accountId;
  const account = await Account.findById(accountId);

  if (!account) res.status(404).json({ message: "Account does not exists" });

  const match = {};
  if (req.query.from) match.createdAt = { $gte: req.query.from };
  if (req.query.to) match.createdAt = { $lte: req.query.to };
  if (req.query.from && req.query.to)
    match.createdAt = { $gte: req.query.from, $lte: req.query.to };

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

  res.status(200).json(account.history);
});

module.exports = router;
