const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    
    try {
      console.log("In validation!!");
      console.log(req.headers.authorization);
      jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET,
        (err, decoded) => {
          if (err) {
            console.log(err);
            res.status(401).send({ error: "Not authenticated" });
          } else {
            console.log(decoded);
            req.tokenpayload = decoded;
            next();
          }
        }
      );
    } catch (err) {
      res.status(500).send({ error: "Error:" + err });
    }
  };