const router = require("express").Router();
const authenticate = require("../auth/authenticate");
const User = require("../auth/user-model");

// get all user accounts
router.get("/", authenticate, async (req, res) => {
  const user = await User.findById(req.user.id);
  await user.populate("accounts").execPopulate();
  res.status(200).json(user.accounts);
});

module.exports = router;
