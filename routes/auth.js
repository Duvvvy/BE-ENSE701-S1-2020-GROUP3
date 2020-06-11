const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
/* POST login. */
router.post("/", function (req, res) {
  passport.authenticate(
    "local",
    { session: false },
    (err, username, userId) => {
      if (err || !username) {
        console.log(username);
        console.log(err);
        return res.status(400).json({
          message: "Something is not right",
        });
      }
      req.login(username, { session: false }, (err, user) => {
        if (err) {
          res.send(err);
        }
        // generate a signed son web token with the contents of user object and return it in the response
        const token = jwt.sign(
          req.body.password + "/" + userId,
          "your_jwt_secret"
        );
        res.cookie("jwt", token, { maxAge: 900000 });
        res.cookie("userId", userId, { maxAge: 900000 });
        return res.json({ token: token, username: username, userId: userId });
      });
    }
  )(req, res);
});

module.exports = router;
