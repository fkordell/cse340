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
  const account_id = parseInt(req.params.account_id);
  let nav = await utilities.getNav();
  const accountTypeSelect = await utilities.updateAccountType()
  const accountData = await accountModel.getAccountById(account_id);

    res.render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_email : accountData.account_email,
      account_firstname : accountData.account_firstname,
      account_lastname : accountData.account_lastname,
      account_id: account_id,
      accountTypeSelect, 
    });

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

//This gets  the account by its type
async function getAccountsByType(req, res) {
  console.log("Received account_type in controller:", req.params.account_type);
  const account_type = req.params.account_type
  console.log("Received account_type in controller:", account_type);
  try {
    const account = await accountModel.getAccountsByType(account_type);
    console.log(`Accounts fetched for type '${account_type}':`, account);
    res.json(account);
} catch (error) {
    console.error('Error fetching accounts by type:', error);
    res.status(500).send('Server error');
}
}

/* ***************************
 * Update Account Type Data
 * ************************** */
async function updateAccountTypePage(req, res) {
  let nav = await utilities.getNav();
  const account_id = req.params.account_id
  console.log("Parsed account_id:", account_id);
  try {
    const accountData = await accountModel.getAccountById(account_id);
    if (!accountData) {
        req.flash("error", "Account not found.");
        return res.status(404).render("account/", {
            title: "Error",
            message: "Account not found",
            nav,
            errors: null,
        });
      }
      return res.render("account/updateAccountType", {
        title: "Update Account Type",
        nav,
        accountTypeSelect: await utilities.updateAccountType(),
        account_id: account_id,
        account: accountData,
        errors: null,
      })
      
  } catch (error) {
      console.error('Update Account Type Error:', error);
      req.flash("error", "Server error during account type update.");
      res.status(500).render("account/updateAccountType", {
          title: "Update Account Type",
          nav,
          accountTypeSelect: await utilities.updateAccountType(),
          errors: null
      });
  }
}

async function updateAccountTypeForm (req, res) {
  let nav = await utilities.getNav();
  const account_id = parseInt(req.body.account_id); 
  const account_type  = req.body.account_type; 
  console.log(account_type)
  const updateResult = await accountModel.updateAccountType(account_id, account_type);
  if (updateResult) {
    req.flash("notice", `Account type updated to ${account_type} successfully.`);
    res.redirect("/account/"); 
} else {
    req.flash("error", "Failed to update account type.");
    res.status(400).render("account/updateAccountType", {
        title: "Update Account Type",
        nav,
        accountTypeSelect: await utilities.updateAccountType(),
        account: accountData,
        errors: null,
    });
}
}

/* ***************************
 *  Build delete account view
 * ************************** */
async function accountDeletePage(req, res) {
  const account_id = req.params.account_id;
  let nav = await utilities.getNav();
  try {
      const accountData = await accountModel.getAccountById(account_id);
      if (!accountData) {
          req.flash("error", "Account not found.");
          return res.status(404).render("account/", {
              title: "Error",
              message: "Account not found",
              nav,
              errors: req.flash('error'),
          });
      }
      return res.render("account/accDelete-confirm", {
          title: "Delete Account",
          nav,
          account_id: account_id,
          accountData: accountData,
          errors: null,
      });
  } catch (error) {
      console.error('Error fetching account data:', error);
      req.flash("error", "Server error during account data retrieval.");
      return res.status(500).render("account/", {
          title: "Server Error",
          message: "An error occurred while fetching account details.",
          nav,
          errors: req.flash('error')
      });
  }
}


/* ***************************
 *  Update Account Data after deletion
 * ************************** */
async function updateAfterDelete (req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.body.account_id);
  const {
    account_firstname,
    account_lastname,
    account_email,
  } = req.body

  const updateResult = await updateAfterDelete(
    account_id,
  )

  if (updateResult) {
    const accountName = account_firstname + " " + account_lastname
    req.flash("notice", `The account for ${accountName} was successfully deleted.`)
    res.redirect("/account/")
  } else {
    const accountTypeSelect = await utilities.updateAccountType()
    const accountName = `${account_firstname} ${account_lastname}`
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).render("account/delete-confirm", {
    title: "Delete " + accountName,
    nav,
    accountTypeSelect: accountTypeSelect,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    })
  }
}
  
  module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, loggedIn, editAccount, updateAccount, updatePassword, updateAccountTypePage, updateAccountTypeForm, getAccountsByType, accountDeletePage, updateAfterDelete }



