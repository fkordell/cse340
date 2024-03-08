const express = require('express');
const router = express.Router();
const utilities = require('../utilities/');
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation')

//Build the login page
router.get("/login", utilities.handleErrors(accountController.buildLogin));
//Build the Registration page
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
router.post(
    "/login",
    (req, res) => {
      res.status(200).send('login process')
    }
  )

module.exports = router;