const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// APIs available
router.get("/", (request, response) => {
  response.json({ message: "API is working!" });
});

// API will handle any request that ends with /api
app.use("/api", router);

// Start the server
app.listen(PORT);
console.log("Magic happens on port " + PORT);
