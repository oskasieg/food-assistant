import User from "../resources/user/user.model";

const jwt = require("jsonwebtoken");
const config = require("../config");

// create new token
export const newToken = (user) =>
  jwt.sign({ id: user._id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
  });

// verify token
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) {
        reject(err);
      }

      resolve(payload);
    });
  });
};

// middleware to controll access
const protect = async (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(400).json({ message: "No authorization header!" });
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(400).json({ message: "No token!" });
  try {
    const payload = await verifyToken(token);
    if (!payload) return res.status(400).json({ message: "No valid token!" });

    req.payloadId = payload.id;
  } catch (e) {
    console.error(e);
  }

  next();
};

module.exports = { newToken, verifyToken, protect };
