const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BudgetSchema = Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User", unique: true },
  accounts: [{ type: Schema.Types.ObjectId, ref: "Account" }],
});

BudgetSchema.post("save", function (err, doc, next) {
  if (err.name === "MongoError" && err.code === 11000)
    next(new Error("Budget already initialized for this user"));
  else next(err);
});

const Budget = mongoose.model("Budget", BudgetSchema);

module.exports = Budget;
