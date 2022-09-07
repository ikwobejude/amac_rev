const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op;
const db = require('../db/db');
const { local_government_area } = require('../model/texPayersmodels');
const saltRounds = 10;

module.exports.agenncyMonthAssessmentChart = async (req, res) => {
	let sql = `
    SELECT
	month (
		agent_assessments.assessment_month
	) AS assement_m,
	sum(
		agent_assessments.assessed_amount
	) AS amount
FROM
	agent_assessments
WHERE
	agent_assessments.agent_rin = ${req.user.id}
GROUP BY
	month (
		agent_assessments.assessment_month
	)`

	let rs = db.query(sql, { type: QueryTypes.SELECT });
	res.json(rs);
}

module.exports.agencyMonthlyPaymentChart = async (req, res) => {
	let sql = `
    SELECT
	month (
		agent_assessments.assessment_month
	) AS assement_m,
	sum(
		agent_assessments.assessed_amount
	) AS amount
FROM
	agent_assessments
WHERE
	agent_assessments.agent_rin = ${req.user.id} and agent_assessments.settlement_status = 1
GROUP BY
	month (
		agent_assessments.assessment_month
	)`

	let rs = db.query(sql, { type: QueryTypes.SELECT });
	res.json(rs);
}






module.exports.monthlyPaidAss = async (req, res) => {
	if (req.user.group_id == 205 || req.user.group_id == 121212) {
		let result = await db.query(`
		SELECT
		MONTHNAME(assessment_date) AS label,
			sum(
				assessments.assessment_amount_paid
			) AS y
			
		FROM
			assessments
		
		WHERE
			YEAR (
				assessments.assessment_date
			) = 2022 AND assessments.settlement_status = 1
			AND tax_office_id = ${req.user.tax_office_id}
		GROUP BY
			assessments.tax_month`, { type: QueryTypes.SELECT });
		//    console.log(result)
		res.json(result)
	} else {
		let result = await db.query(`
		SELECT
		MONTHNAME(assessment_date) AS label,
			sum(
				assessments.assessment_amount_paid
			) AS y
			
		FROM
			assessments
		
		WHERE
			YEAR (
				assessments.assessment_date
			) = 2022 AND assessments.settlement_status = 1
			AND tax_office_id = ${req.user.tax_office_id}
			AND created_by = '${req.user.username}'
		GROUP BY
			assessments.tax_month`, { type: QueryTypes.SELECT });
		//    console.log(result)
		res.json(result)
	}
	
}

module.exports.monthlyUnPaidAss = async (req, res) => {
	if (req.user.group_id == 205 || req.user.group_id == 121212) {
		let res2 = await db.query(`
		SELECT
		MONTHNAME(created_at) AS label,
			sum(
				assessments.assessment_amount
			) AS y
			
		FROM
			assessments
		
		WHERE
			YEAR (
				assessments.created_at
			) = 2022 AND assessments.settlement_status = 0
			AND tax_office_id = ${req.user.tax_office_id}
		GROUP BY
			assessments.tax_month`, { type: QueryTypes.SELECT });
		console.log("new ", res2)
		res.json(res2)
	} else {
		let res2 = await db.query(`
		SELECT
		MONTHNAME(created_at) AS label,
			sum(
				assessments.assessment_amount
			) AS y
			
		FROM
			assessments
		
		WHERE
			YEAR (
				assessments.created_at
			) = 2022 AND assessments.settlement_status = 0
			AND tax_office_id = ${req.user.tax_office_id}
			AND created_by = '${req.user.username}'
		GROUP BY
			assessments.tax_month`, { type: QueryTypes.SELECT });
		console.log("new ", res2)
		res.json(res2)
	}
	
}


module.exports.paymentByItem = async (req, res) => {
	if (req.user.group_id == 205 || req.user.group_id == 121212) {
		let result = await db.query(`
		SELECT
			SUM(
				assessment_item_invoices.amount
			) AS y,
			assessment_items.assessment_item_name AS label
		FROM
			assessment_item_invoices
		INNER JOIN assessment_items ON assessment_item_invoices.assessment_item_id = assessment_items.assessment_item_id
		WHERE
			YEAR (
				assessment_item_invoices.date_log
			) = 2022
		AND assessment_item_invoices.locked = 1
		AND assessment_item_invoices.paid = 1
		AND assessment_item_invoices.tax_office_id = ${req.user.tax_office_id}
		GROUP BY
			assessment_item_invoices.assessment_item_id
		`, { type: QueryTypes.SELECT });

		res.json(result)
	} else {
		let result = await db.query(`
		SELECT
			SUM(
				assessment_item_invoices.amount
			) AS y,
			assessment_items.assessment_item_name AS label
		FROM
			assessment_item_invoices
		INNER JOIN assessment_items ON assessment_item_invoices.assessment_item_id = assessment_items.assessment_item_id
		WHERE
			YEAR (
				assessment_item_invoices.date_log
			) = 2022
		AND assessment_item_invoices.locked = 1
		AND assessment_item_invoices.paid = 1
		AND assessment_item_invoices.tax_office_id = ${req.user.tax_office_id}
		AND assessment_item_invoices.created_by = '${req.user.username}'
		GROUP BY 
			assessment_item_invoices.assessment_item_id
		`, { type: QueryTypes.SELECT });

		res.json(result)
	}

}


module.exports.paymentByOffices = async(req, res) => {
	let result = await db.query(`
	SELECT
	tax_offices.tax_office as label,
	SUM(assessments.assessment_amount_paid) as y
FROM
	assessments
INNER JOIN tax_offices ON assessments.tax_office_id = tax_offices.tax_office_id
WHERE
	assessments.settlement_status = 1 GROUP BY assessments.tax_office_id
	`, { type: QueryTypes.SELECT });

	res.json(result)
}

module.exports.paymentByAgency = async(req, res) => {
	let result = await db.query(`
	SELECT
	agencies.agency_name as label,
	SUM(agent_assessments.amount) as y
FROM
	agent_assessments
INNER JOIN agencies ON agent_assessments.agent_rin = agencies.agency_rin
WHERE
	agent_assessments.settlement_status = 1 GROUP BY agent_assessments.agent_rin
	`, { type: QueryTypes.SELECT });

	res.json(result)
}



module.exports.getLGA = async (req, res)=>{
    let stateID = req.query.stateID;
    local_government_area.findAll({where:{state_id:stateID}}).then(function(result){
        res.send(result);
    })
}




