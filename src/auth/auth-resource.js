const router = require("express").Router();
const User = require("./user-model");
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION || "35s";
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || "2d";

router.post("/register", async (req, res) => {
  if (req.body.password !== req.body.passwordAgain)
    res.status(401).json({ message: "Passwords are not equal" });

  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  try {
    await user.save();

    res.status(201).json(user);
  } catch (err) {
    res.status(401).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await getUser(req.body.email);

    if (!(await user.isPasswordValid(req.body.password)))
      res.status(401).json("Wrong credentials");

    const { accessToken, refreshToken } = await generateTokens({
      id: user._id,
      email: user.email,
    });

    refreshTokens.push(refreshToken);
    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(401).json({ message: err.message });
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
