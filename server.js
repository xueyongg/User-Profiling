const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.all("/", (req, res, next) => {
  res.json({
    code: 400,
    status: "Bad Request",
    internalMessage: "API version is missing. GET /api/v1/users"
  });
  next();
});

// Add a new user based on his loan and saving options
// loan (integer)
// saving (integer)
router.post("/v1/users", (req, res, next) => {
  //   console.log(req);
  let errors = requestIsValid(req);
  let reply = {};

  if (errors.length !== 0) {
    reply.errors = errors;
  } else {
    let user = processRequest(req);
    reply = {
      code: 200,
      status: "OK",
      userMessage: "User created",
      profile: user.profile
    };
  }

  res.json(reply);
  next();
});

// API will handle any request that ends with /api
app.use("/api", router);

// Start the server
app.listen(PORT);
console.log("Server is listening to PORT " + PORT);

// Utility methods

const USER_OPTIONS = [0, 2000, 4000, 6000, 8000, 10000];
function valueIsValid(value) {
  if (USER_OPTIONS.includes(Number(value))) {
    return true;
  } else {
    return false;
  }
}

function requestIsValid(req) {
  let { loan, saving } = req.body;
  let errors = [];

  if (!loan) {
    errors.push({
      code: 422,
      InternalMessage: "Unprocessable Entity",
      UserMessage: "No 'loan' value were provided"
    });
  } else if (!valueIsValid(loan)) {
    errors.push({
      code: 422,
      InternalMessage: "Unprocessable Entity",
      UserMessage:
        "Do not recognice loan value of either 0, 2000, 4000, 6000, 8000, 10000"
    });
  }
  if (!saving) {
    errors.push({
      code: 422,
      InternalMessage: "Unprocessable Entity",
      UserMessage: "No 'saving' value were provided"
    });
  } else if (!valueIsValid(saving)) {
    errors.push({
      code: 422,
      InternalMessage: "Unprocessable Entity",
      UserMessage:
        "Do not recognice saving value of either 0, 2000, 4000, 6000, 8000, 10000"
    });
  }

  // Check if the user has been registered before already. If so, error
  if (false) {
    errors.push({
      code: 400,
      InternalMessage: "Bad Request",
      UserMessage: "User already exist"
    });
  }
  return errors;
}

function processRequest(req) {
  let { loan, saving } = req.body;
  loan = Number(loan);
  saving = Number(saving);
  let user = { loan_score: 0, saving_score: 0, profile: "" };
  if (loan) {
    switch (loan) {
      case 0:
        user.loan_score = 5;
        break;
      case 2000:
        user.loan_score = 4;
        break;
      case 4000:
        user.loan_score = 3;
        break;
      case 6000:
        user.loan_score = 2;
        break;
      case 8000:
        user.loan_score = 1;
        break;
      case 10000:
        user.loan_score = 0;
        break;
      default:
        user.loan_score = 0;
        break;
    }
  }
  if (saving) {
    switch (saving) {
      case 0:
        user.saving_score = 0;
        break;
      case 2000:
        user.saving_score = 1;
        break;
      case 4000:
        user.saving_score = 2;
        break;
      case 6000:
        user.saving_score = 3;
        break;
      case 8000:
        user.saving_score = 4;
        break;
      case 10000:
        user.saving_score = 5;
        break;
      default:
        user.saving_score = 0;
        break;
    }
  }

  let acquired_score = user.saving_score + user.loan_score;
  switch (acquired_score) {
    case 2:
    case 3:
      user.profile = "D";
      break;
    case 4:
    case 5:
      user.profile = "C";
      break;
    case 6:
    case 7:
      user.profile = "B";
      break;
    case 8:
    case 9:
    case 10:
      user.profile = "A";
      break;

    default:
      user.profile = "unprofiled";
      break;
  }

  return user;
}
