const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")

const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

const invCont = invController.invCont;
const invInv = invController.invInv;
const management = invController.management

//route to build inventory classification view
router.get("/type/:classificationId", utilities.handleErrors(invCont.buildByClassificationId));
//route to build iventory by inventory id
router.get("/detail/:inventoryId",utilities.handleErrors(invInv.buildByInventory));
//route to add classification or inventory
router.get("/", utilities.checkaccountType, utilities.handleErrors(management.addCar));
//route to add classification
router.get("/inv/add-classification", utilities.checkaccountType, utilities.handleErrors(invController.buildClass.newClass))
router.get("/add-classification", utilities.checkaccountType, utilities.handleErrors(invController.buildClass.newClass))
//route to add new inventory
router.get("/inv/add-inventory", utilities.checkaccountType, utilities.handleErrors(invController.buildInv.newInv))
router.get("/add-inventory", utilities.checkaccountType, utilities.handleErrors(invController.buildInv.newInv))
//route to post new classification
router.post("/", utilities.checkaccountType, invValidate.classRules(), invValidate.checkClassData, utilities.handleErrors(invController.addClass.addNewClass))
//route to post new inventory
router.post("/add-inventory", utilities.checkaccountType, invValidate.invRules(), invValidate.checkInvData, utilities.handleErrors(invController.addInv.newInv))
//route to work with inventoey.js file
router.get("/getInventory/:classification_id", utilities.handleErrors(invCont.getInventoryJSON))
//route to edit inventory
router.get("/edit/:inv_id", utilities.handleErrors(invCont.editInv))
router.post("/update/",invValidate.invRules(), invValidate.checkUpdateData, invController.updateInv.updateInventory)
// New Route to delete an inventory item
router.get("/delete/:inv_id", utilities.handleErrors(invCont.deleteInv))
router.post("/delete/", utilities.handleErrors(invCont.deleteInventory))

module.exports = router;