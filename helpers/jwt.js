require("dotenv").config();
const jwt = require("jsonwebtoken");

const jwtSign = (payload, secret, options) =>
  new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });

const jwtAuth = (token, secret) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });

module.exports = { jwtSign, jwtAuth };