const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}


/*  **********************************
 *  classification Data Validation Rules
 * ********************************* */

validate.classRules = () => {
    return [

        body("classification_name")
        .trim()
        .escape()
        .matches(/^[A-Za-z]+$/, 'i')
        .isLength({min: 3})
        .withMessage("please enter a valid classification name (no spaces and only characters) minimum of 3 characters")
        .custom(async (classification_name) => {
            const classExists = await invModel.checkClass(classification_name)
            if(classExists){
                throw new Error("Sorry, that classification already exists.")
            }
        })
    ]
}

/*  **********************************
 *  classification check data
 * ********************************* */

validate.checkClassData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            message: null,
            title: "Add New Classification",
            nav,
        })
        return
    }
    next()
}

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */

validate.invRules = () => {
    return[
    // For inv_make
    body("inv_make")
    .trim()
    .escape()
    .isLength({min: 3})
    .withMessage('A valid vehicle MAKE is required. Please have it more than 3 characters'),

    // For inv_model
    body("inv_model")
    .trim()
    .escape()
    .isLength({min: 3})
    .withMessage('A valid vehicle MODEL is required. Please have it more than 3 characters'),

    // For inv_description
    body("inv_description")
    .trim()
    .escape()
    .isLength({min: 5})
    .withMessage('A valid vehicle DESCRIPTION is required. Please have it more than 5 characters'),

    // For inv_image
    body("inv_image")
    .trim()
    .escape()
    .isLength({min: 9})
    .withMessage('A valid vehicle IMAGE PATH is required. Please have it more than 9 characters in this format: /images/vehicles/carname.jpg'),

    // For inv_tn
    body("inv_thumbnail")
    .trim()
    .escape()
    .isLength({min: 9})
    .withMessage('A valid vehicle IMAGE PATH is required. Please have it more than 9 characters in this format: /images/vehicles/carname-tn.jpg'),

    // For inv_price
    body("inv_price")
    .trim()
    .escape()
    .isLength({min: 2})
    .withMessage('A valid vehicle PRICE is required. Please be integer or decimal'),

    // For inv_year
    body("inv_year")
    .trim()
    .escape()
    .isLength({min: 4},{max: 4})
    .withMessage('A valid vehicle YEAR. please be 4 digits. '),

    // For inv_miles
    body("inv_miles")
    .trim()
    .escape()
    .isLength({min: 1})
    .withMessage('A valid vehicle MILES is required.'),

    // For inv_color
    body("inv_color")
    .trim()
    .escape()
    .isLength({min: 1})
    .withMessage('A valid vehicle COLOR is required.'),

    // For classification_id
    body("classifcation_id")
    .trim()
    .escape()
    .custom(async (classification_id) =>{
        const classExists = await invModel.checkClass(classification_id)
        if(classExists){
            throw new error("classification does not exist")
        }
    })
    ]
}

/* ******************************
 * Check INV data and return errors or continue to registration
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
    const {inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id} = req.body
    let errors = []
    let form = await utilities.addInventoryForm()
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-inventory", {
        errors,
        title: "Add New Inventory",
        form,
        nav,
        inv_make,
        inv_model,
        inv_description,
        inv_image, 
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
      })
      return
    }
    next()
  }

  /* ******************************
 * Check INV data and return errors or continue to registration
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const inv_id = parseInt(req.params.inv_id)
    const {inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id} = req.body
    let errors = []
    let classificationSelect = await utilities.addInventoryForm(classification_id)
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/edit-inv", {
        errors,
        title: "Edit" + inv_make + inv_model,
        classificationSelect : classificationSelect,
        nav,
        inv_make,
        inv_model,
        inv_description,
        inv_image, 
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        inv_id
      })
      return
    }
    next()
  }

module.exports = validate;