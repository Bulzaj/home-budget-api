const { getHistory } = require("../history/history-service");

const getExpenditures = async (accountId, from, to) => {
  const expenditures = await getHistory(accountId, from, to, "EXPENDITURE");

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

const getCashFlow = async (accountId, from, to) => {
  const history = await getHistory(accountId, from, to);

  return history.map((operation) => ({
    date: operation.createdAt,
    balance: operation.currentBalance,
  }));
};

const getQueriesFromReq = (req) => {
  if (!req) return;

  return {
    accountId: req.params.accountId,
    from: req.query.from,
    to: req.query.to,
  };
};

module.exports = {
  getExpenditures,
  getCashFlow,
  getQueriesFromReq,
};
