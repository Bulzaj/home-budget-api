const { getHistory } = require("../history/history-service");

const getExpenditures = async (accountId, from, to) => {
  const expenditures = await getHistory(accountId, from, to, "EXPENDITURE");

  console.log(expenditures);
  const result = {};

  expenditures.forEach((element) => {
    if (!result[element.category]) {
      result[element.category] = 1;
      return;
    }
    result[element.category]++;
  });

  return result;
};

module.exports = {
  getExpenditures,
};
