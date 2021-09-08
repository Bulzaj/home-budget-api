const mongoose = require("mongoose");
const { isEmail } = require("validator");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const PASSWORD_MIN_LENGHT = 5;
const SALT_ROUNDS = 10;

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: isEmail,
      message: "Wrong email",
    },
  },
  // TODO: hide password
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [
      PASSWORD_MIN_LENGHT,
      `Password is too short (min ${PASSWORD_MIN_LENGHT})`,
    ],
  },
});

UserSchema.plugin(uniqueValidator, { message: "Email already taken" });

UserSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    const hashedPassword = await bcrypt.hash(this.password, SALT_ROUNDS);
    this.password = hashedPassword;
    next();
  }
  next();
});

UserSchema.methods.isPasswordValid = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.arePasswordsSame = function (passwordAgain) {
  if (this.password !== passwordAgain) {
    this.invalidate("password", "Passwords are not same");
  }
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
