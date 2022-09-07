const { assessments } = require("../model/assessmentModels")


module.exports.officeDashboard = async(req, res) => {
    if(req.user.group_id == 205){
        let assess = await assessments.sum('assessment_amount',  { where:{tax_office_id: req.user.tax_office_id}})
        let payment = await assessments.sum('assessment_amount_paid',  { where:{tax_office_id: req.user.tax_office_id, settlement_status: 1}})
        let unpaid = await assessments.sum('assessment_amount',  { where:{tax_office_id: req.user.tax_office_id, settlement_status: 0}})
        // let paidassess = a
    
        // console.log(allassessment);
        res.render('./offices/dashboard', {
            assess, payment, unpaid
        })
    } else {
        let assess = await assessments.sum('assessment_amount',  { where:{tax_office_id: req.user.tax_office_id, created_by: req.user.username}})
        let payment = await assessments.sum('assessment_amount_paid',  { where:{tax_office_id: req.user.tax_office_id, created_by: req.user.username, settlement_status: 1}})
        let unpaid = await assessments.sum('assessment_amount',  { where:{tax_office_id: req.user.tax_office_id, created_by: req.user.username, settlement_status: 0}})
        // let paidassess = a
        console.log(payment)
        // console.log(allassessment);
        res.render('./offices/dashboard', {
            assess, payment, unpaid
        })
    }
    
}