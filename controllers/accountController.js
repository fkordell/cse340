const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  }

  /* ****************************************
  * Deliver Registration View
  * *************************************** */
 async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
 }

 /* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  console.log("Starting login process");
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  console.log(`Attempting to find account by email: ${account_email}`);
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    console.log("Account not found or credentials mismatch");
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      console.log("Password matches, proceeding to generate token");
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      console.log("Redirecting to /account/");
      return res.redirect("/account/");
    } else {
      console.log("Password does not match");
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(403).send({ message: 'Access Forbidden' });
  }
}



 /* ***************************
 *  Build Login view
 * ************************** */
 async function loggedIn(req, res, next) {
  console.log("Checking if user is logged in for /account/");

  const account_id = res.locals.accountData.account_id;
  console.log(`Fetching account data for account ID: ${account_id}`);
  let nav = await utilities.getNav();

  const accountData = await accountModel.getAccountById(account_id);

  if (accountData) {
    console.log("Account data found, rendering accounthome");
    res.render("account/accounthome", {
      title: "You are Logged in",
      nav,
      errors: null,
    });
  } else {
    console.log("Failed to fetch account data, redirecting to login");
    req.flash("notice", "Sorry unable to login please try again");
    res.status(501).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  }
}


/* ***************************
 *  Build edit account view
 * ************************** */
async function editAccount(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)
  if (accountData){
  res.render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    account_email : accountData.account_email,
    account_firstname : accountData.account_firstname,
    account_lastname : accountData.account_lastname,
    account_id: account_id,
  })}
  else{
      req.flash("notice", "sorry unable to update your information, please try logging in again")
      res.status(501).render("account/login",{
        title: "Login",
        nav,
        errors: null,
      })
}
}

/* ***************************
 *  This is the function to update the account
 * ************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()


  const {account_id, account_firstname, account_lastname, account_email } = req.body
  const updateResult = await accountModel.updateAcc(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    
  )

  if(updateResult){
    utilities.deleteJwt
    const accountData = await accountModel.getAccountById(account_id)
    accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000})
    res.cookie("jwt", accessToken, {httpOnly: true})
    req.flash("notice", `Congrats ${account_firstname}, the account was successfully updated! `)
    res.redirect("/account/")
  }
  else{
    const accountData = await accountModel.getAccountById(account_id)
    req.flash("notice", "Sorry we could not update your account.")
    res.status(501).render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    account_email : accountData.account_email,
    account_firstname : accountData.account_firstname,
    account_lastname : accountData.account_lastname,
    account_id: account_id,
    })
  }

}

/* ***************************
 *  This is the function to update the password
 * ************************** */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const {account_id, account_password} = req.body

  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/update", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  
  
  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  )
  const accountData = await accountModel.getAccountById(account_id)

  if(updateResult){
    req.flash("notice", "The password was successfully updated!")
    res.redirect("/account/")
  }
  else{
    req.flash("notice", "Sorry we could not update your account password.")
    res.status(501).render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    account_email : accountData.account_email,
    account_firstname : accountData.account_firstname,
    account_lastname : accountData.account_lastname,
    account_id: account_id,
    })
  }

}
  
  module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, loggedIn, editAccount, updateAccount, updatePassword }