const router = require("express").Router();
const User = require("./user-model");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION || "35s";
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || "2d";

router.post("/register", async (req, res) => {
  const errors = [];

  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  user.arePasswordsSame(req.body.passwordAgain);
  user.isField(
    req.body.passwordAgain,
    "Password confirmation",
    "passwordAgain"
  );

  try {
    await user.save();

    const { accessToken, refreshToken } = generateTokens({
      id: user._id,
      email: user.email,
    });

    res.status(201).json({ accessToken, refreshToken, email: user.email });
  } catch (err) {
    const errorsArr = Object.values(err.errors);
    errorsArr.map((err) => errors.push(err.properties.message));

    res.status(401).json(errors);
  }
});

const validateLoginReq = (req) => {
  const errors = [];

  if (!req.body.email) {
    errors.push("Email is required");
  } else if (!validator.isEmail(req.body.email)) {
    errors.push("Invalid email address");
  }

  if (!req.body.password) {
    errors.push("Password is required");
  }

  return errors || null;
};

const validateUser = async (req) => {
  const result = {};

  const user = await User.findOne({ email: req.body.email });

  if (user && (await user.isPasswordValid(req.body.password))) {
    result.user = user;
  } else {
    result.errors = ["Wrong credentials"];
  }

  return result;
};

router.post("/login", async (req, res) => {
  let errors = [];
  let user = null;

  errors = validateLoginReq(req);

  if (!errors.length) {
    const result = await validateUser(req);

    result.errors ? (errors = result.errors) : (user = result.user);
  }

  try {
    if (errors.length) {
      const error = new Error();
      error.errors = errors;
      throw error;
    }

    const { accessToken, refreshToken } = generateTokens({
      id: user._id,
      email: user.email,
    });

    refreshTokens.push(refreshToken);
    res.json({ accessToken, refreshToken, email: user.email });
  } catch (err) {
    res.status(401).json(err.errors);
  }
});

// TODO: move refresh tokens to db or cache (redis? )
let refreshTokens = [];

router.post("/refresh-token", (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = await generateAccessToken({
      id: user._id,
      email: user.email,
    });

    return res.json({ accessToken });
  });
});

router.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_ACCESS_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.JWT_REFRESH_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });
};

const getUser = async (email) => {
  const user = await User.findOne({ email: email });

  if (!user) throw new Error("User does not exists");

  return user;
};

const generateTokens = (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  return { accessToken, refreshToken };
};

module.exports = router;
