const express = require('express')
const adminController = require('../controllers/adminController');
const settingsController = require('../controllers/settingsController');
const buildingController = require('../controllers/buildingController');
const businessController = require('../controllers/businessController');
const router = express.Router();


router.route('/dashboard')
    .get(adminController.adminDashboard)
router.route('/payment_by_agencies')
    .get(adminController.paymentByagent)

router.route('/chart_payment_by_assessment')
    .get(adminController.assessmets)

router.route('/chart_pay_assessment_item')
    .get(adminController.paymentByItem)


router.route('/assessment_item')
    .get(settingsController.assessmentItem)
    .post(settingsController.createAssItem)
    

router.route('/view_tax_payers')
.get(async(req, res) => {
    
})

router.route('/individuals')
.get(async(req, res) => {
    adminController.individual(req, res)
})

router.route('/organization')
.get( adminController.oganizations)

router.route('/view_offices')
    .get(adminController.viewOffices)
    .post(adminController.createOffices)

router.post('/edit_agency', adminController.updateAgencyInfo1)

router.post('/add_staff_to_office', adminController.addUserTofficeAsStaff)

router.get('/view_office_users', adminController.viewOfficeUser)

router.route('/bulding_type')
.get(buildingController.buildingTypes)
.post(buildingController.createBuildingType)
.put(buildingController.updateBusinessType);
router.get('/building_type/:id', buildingController.deleteBuildingType)

// business size
router.route('/business_size')
.get(businessController.getBusinessSize)
.post(businessController.storeBusinessSize)
.put(businessController.editBusinessSize);
router.get('/building_size/:id', businessController.deleteBusinessSize)

// business operation
router.route('/business_operation')
.get(businessController.businessOperations)
.post(businessController.storeBusinessOperation)
.put(businessController.updateBusinessOperation);
router.get('/business_operation/:id', businessController.deleteBusinessSize);


// business operation
router.route('/business_category')
.get(businessController.businessCategory)
.post(businessController.storeBusinessCategory)
.put(businessController.editBusinesscategory);
router.get('/business_category/:id', businessController.deleteBuinsessCategory)

// BUSINESS SECTOR

router.route('/business_sector')
.get(businessController.businessSector)
.post(businessController.storeBusinessSector)
.put(businessController.editBusinessSector);
router.get('/business_sector/:id', businessController.deleteBuinsessSector)

module.exports = router;