const router = require("express").Router();
const authenticate = require("../auth/authenticate");
const spec = require("./specification-service");

router.get("/expenditures/:accountId", authenticate, async (req, res) => {
  const { accountId, from, to } = spec.getQueriesFromReq(req);

  try {
    const result = await spec.getExpenditures(accountId, from, to);
    res.status(200).send(result);
  } catch (err) {
    res.status(404).json(err);
  }
});

router.get("/cash-flow/:accountId", authenticate, async (req, res) => {
  const { accountId, from, to } = spec.getQueriesFromReq(req);

  try {
    const result = await spec.getCashFlow(accountId, from, to);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = router;
