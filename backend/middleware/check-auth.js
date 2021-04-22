const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "secret_encrypt_doc_appointment");
    req.userData = {email: decodedToken.email, userId: decodedToken.userId, userName: decodedToken.userName, shopName: decodedToken.shopName}
    next();
  } catch (error) {
    res.status(401).json({ message:"Auth failed!" });
  }
}
