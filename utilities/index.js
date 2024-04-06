const invModel = require("../models/inventory-model")
const accModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const Util = {}
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }


/* **************************************
* Build the car view HTML
* ************************************ */
Util.buildVehicleInformation = async function(vehicleData){
  let carInfo = "";
  if(vehicleData.length > 0){
    carInfo += '<div class="CarSection">';
    vehicleData.forEach(vehicle => {
      carInfo += '<div><img src="' + vehicle.inv_image
                 +'" alt="Image of '+ vehicle.inv_make + ' '
                 + vehicle.inv_model + ' on CSE Motors" /></div>';
      carInfo += '<div class="CarDetails">';
      carInfo += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details </h2>';
      carInfo +=  '<h3> Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</h3>';
      carInfo += '<p> <strong> Description: </strong>' + vehicle.inv_description + '</p>';
      carInfo += '<p> <strong> Color: </strong>' + vehicle.inv_color + '</p>';
      carInfo += '<p> <strong> Miles: </strong>' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>';
      carInfo += '</div>';
    });
    carInfo += '</div>';
  } else {
    carInfo += '<p class="notice"> Sorry, there is no information about this vehicle. </p>';
  }
  return carInfo;
}

/* **************************************
* build form inventory
* ************************************ */
Util.addInventoryForm = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let form = '<select id="newClass" name="classification_id" required >'
  form += '<option value =""> Please select a classification </option>'
  data.rows.forEach((row) => {
    form += '<option value="'+row.classification_id + '">'
    + row.classification_name + '</option>'
  })
  form += '</select>'
  return form
}


/* **************************************
* build form account
* ************************************ */
Util.updateAccountType = async function (req, res, next) {
  let data = await accModel.getAccountType()
  let form = '<select id="accountTypeSelect" name="account_id" required >'
  form += '<option value =""> Please select an account type </option>'
  data.rows.forEach((row) => {
    form += '<option value="'+row.account_type + '">'
    + row.account_type + '</option>'
  })
  form += '</select>'
  return form
}



/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("notice", "Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     if (res.locals.accountData.account_type == "Employee" || res.locals.accountData.account_type =="Admin")
     {
       res.locals.allow = 1;

     }
     else{
       res.locals.allow = 0;
     }
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  console.log("Entering checkLogin middleware.");
  if (res.locals.loggedin) {
    console.log("User is logged in, proceeding to next middleware/route.");
    next();
  } else {
    console.log("User not logged in, redirecting to login page.");
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
}



 /* ****************************************
 *  Check if they are allowed or not on a page by account type
 * ************************************ */
Util.checkaccountType = (req, res, next) => {
  if (res.locals.accountData) {
    if (res.locals.allow) {
      next()
    } else {
    req.flash("notice", "You do not have access to this page.")
    return res.redirect("/account/")
    }
  } else {
    req.flash("notice", "Please log in")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Deletes the cookies and jwt
 * ************************************ */
Util.deleteJwt = (req, res, next) => {
  if(req.cookies.jwt){
    res.clearCookie("jwt", {httpOnly: true})
    return res.status(403).redirect("/")
  } else {
    next()
  }
}

/* **************************************
* build form inventory
* ************************************ */
Util.selectAccount = async function (req, res, next) {
  let data = await accModel.getAccountInfo()
  let form = '<select id="account" name="message_to" required >'
  
  form += '<option value =""> Select a recipient </option>'
  data.rows.forEach((row) => {
    form += '<option value="'+row.account_id + '">'
    + row.account_firstname + '</option>'
  })
  form += '</select>'
  return form
}

Util.checkAllLogin = (req, res, next) => {
  if (res.locals.accountData) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util