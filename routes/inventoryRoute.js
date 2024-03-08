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
router.get("/", utilities.handleErrors(management.addCar));
//route to add classification
router.get("/inv/add-classification", utilities.handleErrors(invController.buildClass.newClass))
router.get("/add-classification", utilities.handleErrors(invController.buildClass.newClass))
//route to add new inventory
router.get("/inv/add-inventory", utilities.handleErrors(invController.buildInv.newInv))
router.get("/add-inventory", utilities.handleErrors(invController.buildInv.newInv))
//route to post new classification
router.post("/", invValidate.classRules(), invValidate.checkClassData, utilities.handleErrors(invController.addClass.addNewClass))
//route to post new inventory
router.post("/add-inventory", invValidate.invRules(), invValidate.checkInvData, utilities.handleErrors(invController.addInv.newInv))

module.exports = router;