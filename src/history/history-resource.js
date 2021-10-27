const router = require("express").Router();
const authenticate = require("../auth/authenticate");
const history = require("./history-service");

router.get("/:accountId", authenticate, async (req, res) => {
  const accountId = req.params.accountId;
  const from = req.query.from;
  const to = req.query.to;

  try {
    const result = await history.getHistory(accountId, from, to);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = router;