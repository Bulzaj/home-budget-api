const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountsSchema = Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User", unique: true },
  accounts: [
    {
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
      operationsHistory: [
        { type: Schema.Types.ObjectId, ref: "AccountAction", unique: true },
      ],
    },
  ],
});

const Accounts = mongoose.model("Accounts", AccountsSchema);

module.exports = Accounts;
