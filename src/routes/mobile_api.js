const express = require('express');
const mobileApiController = require('../controllers/mobileApiController');
const router = express.Router();

// mobile login endpoint
router.route('/login')
.post(mobileApiController.APIlogin)

// BUILDINGS 
router.route('/building_types')
.get(mobileApiController.mobileAuth ,mobileApiController.buildingTypes);

router.route('/create_building')
.post(mobileApiController.mobileAuth, mobileApiController.createBuilding)

router.route('/create_buildings')
.post(mobileApiController.mobileAuth, mobileApiController.createMuiltipleBuilings)


// business 
router.get('/business_category', mobileApiController.mobileAuth, mobileApiController.businessCategories);


router.get('/business_sector', mobileApiController.mobileAuth, mobileApiController.businessSector);

router.get('/business_size', mobileApiController.mobileAuth, mobileApiController.businessSize);

router.get('/business_operation/:id', mobileApiController.mobileAuth, mobileApiController.businessOperation);


router.post('/create_businesses', mobileApiController.mobileAuth, mobileApiController.apiBusinesses)



router.get('/assessment_items', mobileApiController.mobileAuth, mobileApiController.taxItems)



module.exports = router;

