const router = require("express").Router();
const authenticate = require("../auth/authenticate");
const Accounts = require("./accounts-model");

// get all user accounts
router.get("/", authenticate, async (req, res) => {
  const result = await Accounts.find({ owner: req.user.id });
  if (result.length === 0)
    res.status(404).json({ message: "Accounts does not found" });
  res.status(200).json(result);
});

module.exports = router;
