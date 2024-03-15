const express = require('express');
const router = express.Router();
const utilities = require('../utilities/');
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation')

//accessing the build
const buildLogin = accountController.buildLogin
//Build the login page
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Route to build login page
// router.get("/logout", utilities.deleteJwt, utilities.handleErrors(accountController.buildLogin))
//Build the Registration page
router.get("/register", utilities.handleErrors(accountController.buildRegister))
//Route to say they have logged in successfully  
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.loggedIn))

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
    res.status(200).send('Logged In')
    res.redirect("/account");
  }
)

module.exports = router;