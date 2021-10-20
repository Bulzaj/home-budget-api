const jwt = require("jsonwebtoken");
const User = require("./user-model");

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) res.sendStatus(401);

  jwt.verify(token, process.env.JWT_ACCESS_KEY, async (err, result) => {
    if (!result) {
      res.sendStatus(403);
      next();
    } else {
      const user = await User.findOne({ _id: result.id });

      if (!user || err) {
        res.sendStatus(403);
        next();
      }

      req.user = result;
      next();
    }
  });
};

module.exports = authenticate;
