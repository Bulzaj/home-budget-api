import { mongoose, Schema } from "mongoose";

const BudgetSchema = mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const Budget = mongoose.model("Budget", BudgetSchema);

module.exports = Budget;
