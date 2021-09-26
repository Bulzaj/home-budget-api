const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AcountSchema = Schema({
  name: String,
  ammount: Number,
  currencyCode: String,
});

const Account = mongoose.model("Account", AcountSchema);

module.exports = Account;
