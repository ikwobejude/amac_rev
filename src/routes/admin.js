const express = require('express')
const adminController = require('../controllers/adminController');
const settingsController = require('../controllers/settingsController');
const admin = express.Router();


admin.route('/dashboard')
    .get(adminController.adminDashboard)
admin.route('/payment_by_agencies')
    .get(adminController.paymentByagent)

admin.route('/chart_payment_by_assessment')
    .get(adminController.assessmets)

admin.route('/chart_pay_assessment_item')
    .get(adminController.paymentByItem)


admin.route('/assessment_item')
    .get(settingsController.assessmentItem)
    .post(settingsController.createAssItem)
    

admin.route('/view_tax_payers')
.get(async(req, res) => {
    
})

admin.route('/individuals')
.get(async(req, res) => {
    adminController.individual(req, res)
})

admin.route('/organization')
.get( adminController.oganizations)

admin.route('/view_offices')
    .get(adminController.viewOffices)
    .post(adminController.createOffices)

admin.post('/edit_agency', adminController.updateAgencyInfo1)

admin.post('/add_staff_to_office', adminController.addUserTofficeAsStaff)

admin.get('/view_office_users', adminController.viewOfficeUser)

module.exports = admin;