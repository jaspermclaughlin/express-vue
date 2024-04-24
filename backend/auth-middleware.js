const crypto = require("crypto");

//From: https://stackoverflow.com/questions/23616371/basic-http-authentication-with-node-and-express-4/33905671#33905671
function basicAuth(req, res, next) {
  const auth = {
    login: "admin",
    hashedPassword:
      "b04047fbbd9dd9b4fd8ce3bed0a513a7e7de0de285aa57613dede051f8877edd",
  };

  const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
  const [login, password] = Buffer.from(b64auth, "base64")
    .toString()
    .split(":");
  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  if (
    login &&
    hashedPassword &&
    login === auth.login &&
    hashedPassword === auth.hashedPassword
  ) {
    return next();
  }

  res.set("WWW-Authenticate", 'Basic realm="401"');
  res.status(401).send("Authentication required.");
}

module.exports = {
  basicAuth,
};
