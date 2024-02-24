const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

const invCont = invController.invCont;
const invInv = invController.invInv;

router.get("/type/:classificationId", utilities.handleErrors(invCont.buildByClassificationId));
router.get("/detail/:inventoryId",utilities.handleErrors(invInv.buildByInventory));

module.exports = router;