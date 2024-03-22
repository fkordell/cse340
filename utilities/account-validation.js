const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
        .trim()
        .isLength({ min: 3})
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (emailExists){
            throw new Error("Email exists. Please log in or use different email")
          }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

/*  **********************************
 * Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
        // valid email is required and cannot already exist in the database
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() 
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (!emailExists){
            throw new Error("Email does not exist. Please try again")
            }
        }),
        body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("password is invalid and does not meet the requirements.")
  ]
}

/* ******************************
* Check data and return errors or continue to registration
* ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkRegLogin = async (req, res, next) => {
  const {account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

/* ******************************
* Errors will be directed back to the edit view 
* ***************************** */
validate.checkNewData = async (req, res, next) => {
  const account_id = parseInt(req.params.account_id)
  let errors = []

  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

    res.render("account/update", {
      errors,
      title: "Edit Account",
      nav,
      account_firstname : res.locals.accountData.account_firstname,
      account_lastname : res.locals.accountData.account_lastname,
      account_email : res.locals.accountData.account_email,
      account_id : account_id,

    })
    return
  }
  next()
}

/*  **********************************
*  validate updated account info
* ********************************* */
validate.checkAccountUpdate = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),
  
    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), 
  
      // valid email is required and cannot already exist in the database
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() 
      .withMessage("A valid email is required.")
        
   ]
}

/*  **********************************
*  Pasword validation
* ********************************* */
validate.passwordValidation = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
  }
  
  module.exports = validate