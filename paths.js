const express = require("express");
const router = express.Router();
const postgres = require("./helpers/db");
require("dotenv").config();

// Router middleware fired on every query
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

router.get("/", (req, res) => {
console.log("ehpeei basepath queried...")
});

router.post("/register", async (req, res) => {
  const userExist = await postgres.query(
    'SELECT username from "user" WHERE username=$1',
    [req.body.userName]
  );
  if (userExist === 0){
    const DATE = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const insertUserQuery = await postgres.query(
      'INSERT INTO "user"(username, password, created_on, last_login) values($1,$2,$3,$4) RETURNING username',
      [req.body.userName,req.body.userPass,DATE,DATE]
    );
    console.log(insertUserQuery);
    res.json({body:"Password set!"});
    console.log("Register POST request received...");
  } else {
    res.json({body:'Username already exists!' + "\n" + "\n" + 'Please use "login" instead of "register".'});
    console.log("Duplicate user attempting signup...");
  }
});

router.post("/login", async (req,res) => {
  
})

router.get("/test", (req, res) => {
  res.json({body:"Fuck you!"});
  console.log("Test queried...");
});

module.exports = router;
