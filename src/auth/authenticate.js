const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) res.sendStatus(401);

  jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
    if (err) res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = authenticate;
