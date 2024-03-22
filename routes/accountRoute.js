const express = require('express');
const router = express.Router();
const utilities = require('../utilities/');
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation')

//accessing the build
const buildLogin = accountController.buildLogin
//Build the login page
router.get("/login", utilities.handleErrors(buildLogin));
// Route to build logout page
router.get("/logout", utilities.deleteJwt, utilities.handleErrors(buildLogin))
//Build the Registration page
router.get("/register", utilities.handleErrors(accountController.buildRegister))
//Route to say they have logged in successfully  
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.loggedIn))

// Process the registration data
router.post("/register", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post("/login", regValidate.loginRules(), regValidate.checkRegLogin, utilities.handleErrors(accountController.accountLogin))

router.post("/login", (req, res) => {res.status(200).send('Login Process')})

//Route to update the users account
router.get("/update", utilities.handleErrors(accountController.editAccount))

//route to post for update login info
router.post("/updateAccount", regValidate.checkAccountUpdate(), regValidate.checkNewData, utilities.handleErrors(accountController.updateAccount))

//route to post for updated password
router.post("/updatePassword", regValidate.passwordValidation(), regValidate.checkNewData, utilities.handleErrors((accountController.updatePassword)))


module.exports = router;