const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}
const invInv = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by inventory id
 * ************************** */
invInv.buildByInventory = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  const vehicleData = await invModel.getInventoryByIdentityId(inv_id)
  const carInfo = await utilities.buildVehicleInformation(vehicleData)
  let nav = await utilities.getNav()
  const VehicleMake = vehicleData[0].inv_make
  const VehicleModel = vehicleData[0].inv_model
  res.render("./inventory/vehicle", {
    title: VehicleMake +" "+ VehicleModel, 
    nav, 
    carInfo,
  })
}
  




module.exports = {invCont, invInv}