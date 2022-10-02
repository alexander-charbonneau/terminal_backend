const express = require("express");
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

// define the home page route
router.get("/", (req, res) => {
console.log("ehpeei basepath queried...")
});
// define the about route
router.get("/testy", (req, res) => {
  res.json({body:"Fuck you!"});
  console.log("Testy queried...");
});

module.exports = router;
