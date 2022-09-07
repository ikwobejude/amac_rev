const { assessments } = require("../model/assessmentModels")
const { tax_payers } = require("../model/texPayersmodels")


module.exports.selfAssessDashboard = async(req, res) => {
    
    let details = await tax_payers.findOne({where: {taxpayer_rin: req.user.username} })
    let assess = await assessments.findAll({where: {tax_payer_rin: req.user.username} })
    let count = await assessments.count({where: {tax_payer_rin: req.user.username} })
    
    let total = await assessments.sum('assessment_amount_paid',{where: {tax_payer_rin: req.user.username, settlement_status:1} })
    res.render('./self_assessment/dashboard', {
        details, assess, total, count
    })

}