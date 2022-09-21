const express = require('express')
const adminController = require('../controllers/adminController');
const settingsController = require('../controllers/settingsController');
const admin = express.Router();


admin.route('/dashboard')
    .get(async (req, res) => {
        adminController.adminDashboard(req, res);
    })
admin.route('/payment_by_agencies')
    .get(async (req, res) => {
        adminController.paymentByagent(req, res);
    })

admin.route('/chart_payment_by_assessment')
    .get(async (req, res) => {
        adminController.assessmets(req, res);
    })

admin.route('/chart_pay_assessment_item')
    .get(async (req, res) => {
        adminController.paymentByItem(req, res);
    })


admin.route('/assessment_item')
    .get(async (req, res) => {
        settingsController.assessmentItem(req, res)
    })
    .post(async (req, res) => {
        settingsController.createAssItem(req, res)
    })
    

admin.route('/view_tax_payers')
.get(async(req, res) => {
    
})

admin.route('/individuals')
.get(async(req, res) => {
    adminController.individual(req, res)
})

admin.route('/organization')
.get(async(req, res) => {
    adminController.oganizations(req, res)
})

admin.route('/view_offices')
    .get(async (req, res) => {
        adminController.viewOffices(req, res)
    })
    .post(async (req, res) => {
        adminController.createOffices(req, res)
    })

admin.post('/edit_agency', async (req, res) => {
    adminController.updateAgencyInfo1(req, res)
})

admin.post('/add_staff_to_office', async(req, res)=> {
    adminController.addUserTofficeAsStaff(req, res);
})

admin.get('/view_office_users', async(req, res) => {
    adminController.viewOfficeUser(req, res);
})

module.exports = admin;