const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = Schema({
  owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  name: {
    type: String,
    required: true,
  },
  ammount: {
    type: Number,
    default: 0,
  },
  // TODO: Add enum with currency codes
  currencyCode: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return !value.length !== 3;
      },
      message: function (props) {
        return "Currency code should contains three characters";
      },
    },
  },
});

AccountSchema.virtual("history", {
  ref: "Operation",
  localField: "_id",
  foreignField: "account",
});

AccountSchema.set("toObject", { virtuals: true });
AccountSchema.set("toJSON", { virtuals: true });

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;
