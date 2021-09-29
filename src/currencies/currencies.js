const fs = require("fs").promises;

const CURRENCIES_FILE = "./src/currencies/currencies.json";

const getCurrencies = async () => {
  const buff = await fs.readFile(CURRENCIES_FILE);
  const currencies = JSON.parse(buff);
  return currencies;
};

const getCurrencyCodes = async () => {
  const currencies = await getCurrencies();
  const currencyCodes = Object.keys(currencies);
  return currencyCodes;
};

module.exports = {
  getCurrencies,
  getCurrencyCodes,
};
