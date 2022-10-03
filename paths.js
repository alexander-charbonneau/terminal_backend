const express = require("express");
const router = express.Router();
const postgres = require("./helpers/db");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");
const { jwtSign, jwtAuth } = require("./helpers/jwt")
const jwtSecretKey = process.env.JWT_SECRET_KEY;
require("dotenv").config();

// Router middleware fired on every query
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

router.get("/", (req, res) => {
console.log("ehpeei basepath queried...")
});
// REGISTER ENDPOINT
router.post("/register", async (req, res) => {
  const userExist = await postgres.query(
    'SELECT from "user" WHERE username=$1',
    [req.body.userName]
  );
  if (userExist.rowCount === 0){
    const passwordHash = await bcrypt.hash(req.body.userPass, 10);
    const DATE = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const insertUserQuery = await postgres.query(
      'INSERT INTO "user"(id,username, password, created_on, last_login) values($1,$2,$3,$4,$5) RETURNING username',
      [uuidv4(),req.body.userName,passwordHash,DATE,DATE]
    );
    res.json({body:'Password set! You may now login.'});
    console.log(req.body.userName + " added to the database!");
  } else {
    res.json({body:'Username already exists!' + "\n" + "\n" + 'Please use "login" instead of "register".'});
    console.log("Duplicate user attempting signup...");
  }
});
// LOGIN ENDPOINT
router.post("/login", async (req,res) => {
  const userExist = await postgres.query(
    'SELECT from "user" WHERE username=$1',
    [req.body.userName]
  );
  if (userExist.rowCount === 1){
    const userPull = await postgres.query(
      'SELECT id, username, password from "user" WHERE username=$1',
      [req.body.userName]
    );
    const passMatch = await bcrypt.compare(
      req.body.userPass,
      userPull.rows[0].password
    );
    if (passMatch){
      jwtSign({ userID: userPull.rows[0].id, userName: userPull.rows[0].username }, jwtSecretKey,{ expiresIn: "7d" })
        .then(token => {
          res.json({body:"Welcome " + req.body.userName + "!", isLoggedIn: true, token});
        })
        .catch(err => {
          console.log(err);
          res.json({ loggedIn: false, status: "Try again later" });
        });
      console.log(userPull.rows[0].username + " logged in!");
    } else {
      res.json({body:"Invalid username or password!", isLoggedIn: false});
      console.log("No match!");
    }
  } else {
    res.json({body:"Invalid username or password!", isLoggedIn: false});
    console.log("Account doesn't exist!");
  }

})
// JWTCHECK ENDPOINT
router.post("/jwtcheck", (req, res) => {

  if (req.body.token === null){
    console.log("Not signedin.")
  } else {
    jwtAuth(req.body.token, jwtSecretKey)
    .then(async decoded => {
  
      const userMatch = await postgres.query(
        'SELECT username FROM "user" WHERE username = $1',
        [decoded.userName]
      );
      if (userMatch.rowCount === 0) {
        res.json({ loggedIn: false, token: null });
        return;
      } else {
        res.json({ loggedIn: true, userName: decoded.userName });
        return
      } 
    })
  }

  
});
// TEST ENDPOINT
router.get("/test", (req, res) => {
  res.json({body:"Fuck you!"});
  console.log("Test queried...");
});

module.exports = router;
