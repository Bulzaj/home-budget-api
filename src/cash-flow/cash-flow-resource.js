const router = require("express").Router();
const authenticate = require("../auth/authenticate");
const cashFlow = require("./cash-flow-service");

router.get("/expenditures/:accountId", authenticate, async (req, res) => {
  const accountId = req.params.accountId;
  const from = req.query.from;
  const to = req.query.to;

  try {
    const result = await cashFlow.getExpenditures(accountId, from, to);
    res.status(200).send(result);
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = router;
