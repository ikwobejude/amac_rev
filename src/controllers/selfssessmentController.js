const { assessments } = require("../model/assessmentModels")
const { tax_payers } = require("../model/texPayersmodels")


exports.selfAssessDashboard = async(req, res) => {
    
    let details = await tax_payers.findOne({where: {taxpayer_rin: req.user.username} })
    let assess = await assessments.findAll({where: {tax_payer_rin: req.user.username}, raw:true })
    let count = await assessments.count({where: {tax_payer_rin: req.user.username} })
    
    let total = await assessments.sum('assessment_amount_paid',{where: {tax_payer_rin: req.user.username, settlement_status:1} })
    res.render('./self_assessment/dashboard', {
        details: details.toJSON() , assess, total, count
    })

}

exports.applyTCC = async(req, res) => {
    res.status(200).render('./self_assessment/tcc')
}

exports.allTcc = async(req, res) => {
    const yearlyAssess = await assessments.findAll({
        attributes: [
            'taxpayer_rin',
            'invoice_number',
            'created_by',
            'tax_month',
            'tax_year',
            [Sequelize.fn('sum', Sequelize.col('assessment_amount_paid')), 'total']
        ],
        raw:true,
        where : { created_by: req.user.username,},
        group: 'tax_year' 
    })

    
    res.status(200).render('', {
        yearlyAssess
    }) 
}