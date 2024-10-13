const jwt = require("jsonwebtoken");
const SECRET_KEY = "TEMP_KEY";
// const SECRET_KEY = "your_secret_key";
const verifyToken = (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1]; // Extract the token part
  } else {
    console.log("No token found or invalid format");
    return res.status(401).send({ message: "Unauthorized!" });
  }

  if (token == null || token === "null") {
    console.log("Token is null");
    return res.status(401).send({ message: "Unauthorized!" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log("Token verification failed");
      return res.status(401).send({ message: "Unauthorized!" });
    }

    // Attach the decoded token to the request object
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
