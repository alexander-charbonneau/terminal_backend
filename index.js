const express = require("express");
const backend = express();
const helmet = require("helmet");// Middleware for automatic http headers
const cors = require("cors");// Middleware to automatically enable CORS
const paths = require("./paths");
const session = require("express-session");
const server = require("http").createServer(backend);
require("dotenv").config();

// Constants

const port = process.env.PORT;

// Dependancies init

backend.use(helmet()); 
backend.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
); 
backend.use(express.json()); // Express built-in middleware (parses incoming JSON requests and puts the parsed data in req.body)

backend.use("/ehpeei", paths);

// Server start

backend.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
