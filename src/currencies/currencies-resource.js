const router = require("express").Router();
const fs = require("fs").promises;

const CURRENCIES_FILE = "./src/currencies/currencies.json";

router.get("/", async (req, res) => {
  const buff = await fs.readFile(CURRENCIES_FILE);
  const currencies = JSON.parse(buff);
  res.status(201).json(currencies);
});

module.exports = router;
