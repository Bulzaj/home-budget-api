const mongoose = require("mongoose");

const ACTION_CATEGORIES = {
  EXPENDITURE: [
    "FOODS AND DRINKS",
    "HOUSE",
    "CLOTHES",
    "TRANSPORT",
    "ENTERTAINMENT",
    "PERSONAL CARE",
    "TRAINING",
    "FAMILY",
    "GIFTS",
    "EDUCATION",
    "HEALTH",
    "RELAX",
    "OTHERS",
    "INSTALMENT",
    "TAX AND ADMINISTRATION",
    "CONSUMER ELECTRONICS",
  ],
  INCOME: ["GIFT", "SALARY", "OTHERS", "TOP UP"],
};

const AccountActionSchema = mongoose.Schema({
  type: { type: String, required: true, enum: ["INCOME", "EXPENDITURE"] },
  ammount: { type: Number, required: true },
  description: { type: String, required: false },
  category: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        if (this.type === Object.keys(ACTION_CATEGORIES)[0]) {
          if (!ACTION_CATEGORIES.EXPENDITURE.includes(v)) return false;
        }

        if (this.type === Object.keys(ACTION_CATEGORIES)[1]) {
          if (!ACTION_CATEGORIES.INCOME.includes(v)) return false;
        }

        return true;
      },
    },
    message: function (props) {
      return "Wrong category";
    },
  },
  createdAt: { type: Date, required: true, default: Date.now },
});

const AccountAction = mongoose.model("AccountAction", AccountActionSchema);

module.exports = AccountAction;
