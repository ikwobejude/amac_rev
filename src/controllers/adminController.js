const { Sequelize, QueryTypes, where } = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../db/db')
const validation = require('../config/validation');
const { individual, companies, tax_offices } = require("../model/assessmentModels");
const { assessments } = require("../model/assessmentModels");
const { Users, User_groups } = require('../model/userModel');

module.exports.adminDashboard = async (req, res) => {
    try {

        let individualCount =  await individual.count();
        let companyCount = await companies.count()
        let total = await assessments.sum('assessment_amount_paid', { where: { settlement_status: 1 } })
        res.render('./admin/dashboard', {
            individualCount,
            companyCount, total
        })
    } catch (err) {

    }
}


function rannumbs(len) {
    len = len || 100;
    var nuc = "0123456789";
    var i = 0;
    var n = 0;
    s = '22';
    while (i <= len - 1) {
        n = Math.floor(Math.random() * 4);
        s += nuc[n];
        i++;
    }
    return s;
}


module.exports.individual = async (req, res) => {
    try {
        let perPage = 20;   // number of records per page
        var page = req.query.page || 1
        let offset = perPage * page - perPage;
        let prm = req.query;
        let uri2 = `/admin/individuals?individual_name=${prm.office}&user_rin=${prm.tin}&mobile_number_1=${prm.registered_on}&email_addresss_1=${prm.registered_to}&Button_DoSearch=Search`;
        let uri1 = "/admin/individuals?"

        let data = await individual.findAll({ limit: perPage, offset: offset, order: [['id_individual', 'DESC']] },);
        let count = await individual.count({ limit: perPage, offset: offset, order: [['id_individual', 'DESC']] },);
        console.log("norm")

        res.render('./admin/individuals/individual', {
            data,
            current: page,
            pages: Math.ceil(count / perPage),
            prm: prm.Button_DoSearch,
            uri2, uri1
        })

    } catch (error) {
        console.log(error)
    }



}

module.exports.oganizations = async (req, res) => {
    let perPage = 20;   // number of records per page
    var page = req.query.page || 1
    let offset = perPage * page - perPage;
    let prm = req.query;
    let uri2 = `/admin/organization?company_name=${prm.office}&company_rin=${prm.tin}&mobile_number_1=${prm.registered_on}&email_addresss_1=${prm.registered_to}&Button_DoSearch=Search`;
    let uri1 = "/admin/organization?"
    if (req.query.Button_DoSearch) {
        let data = await companies.findAll({
            Where: {
                [Op.and]: [
                    req.query.company_rin && { company_rin: { [Op.like]: `${req.query.company_rin}` } },
                    req.query.company_name && { company_name: { [Op.like]: `${req.query.company_name}` } },
                    req.query.mobile_number && { mobile_number: { [Op.like]: `${req.query.mobile_number}` } },
                    req.query.email_addresss && { email_addresss: { [Op.like]: `${req.query.email_addresss}` } }
                ],
            }
        });
        let count = await companies.count({
            Where: {
                [Op.and]: [
                    req.query.company_rin && { company_rin: { [Op.like]: `${req.query.company_rin}` } },
                    req.query.company_name && { company_name: { [Op.like]: `${req.query.company_name}` } },
                    req.query.mobile_number && { mobile_number: { [Op.like]: `${req.query.mobile_number}` } },
                    req.query.email_addresss && { email_addresss: { [Op.like]: `${req.query.email_addresss}` } }
                ],
            }
        });

        res.render('./admin/organization/organization', {
            data,
            current: page,
            pages: Math.ceil(count / perPage),
            prm: prm.Button_DoSearch,
            uri2, uri1
        })
    }

    let data = await companies.findAll({ limit: perPage, offset: offset, order: [['id_company', 'DESC']] },);
    let count = await companies.count({ limit: perPage, offset: offset, order: [['id_company', 'DESC']] },);


    res.render('./admin/organization/organization', {
        data,
        current: page,
        pages: Math.ceil(count / perPage),
        prm: prm.Button_DoSearch,
        uri2, uri1
    })
}



// agencies 


module.exports.viewOffices = async (req, res) => {
    try {
        let offices = await tax_offices.findAll();
        let usergroup = await User_groups.findAll()
        res.render('./offices/offices', {
            offices, usergroup
        })
    } catch (error) {
        console.log(error)
    }

}

module.exports.createOffices = async (req, res) => {
    try {

        const { error, value } = validation.officeV.validate(req.body);
        if (error) {
            res.status(201).json({ err: error.message });
        } else {
            let t1 = await db.transaction();
            try {
                let officeNumber = rannumbs(6);
                let updateInfo = {
                    tax_office: value.tax_office,
                    tax_office_id: officeNumber,
                    created_by: req.user.username,
                    created_at: new Date(),
                    email: value.email,
                    mobile_number: value.user_phone,
                    address: value.address,
                }

                let user = {
                    group_id: 121212,
                    name: value.tax_office,
                    username: value.email,
                    email: value.email,
                    user_phone: value.user_phone,
                    tax_office_id: officeNumber,
                    password: await bcrypt.hash('1234567', saltRounds)
                }
                let newOffice = new tax_offices(updateInfo);
                let officeAcc = new Users(user)

                await newOffice.save({ transaction: t1 });
                await officeAcc.save({ transaction: t1 });
                await t1.commit();
                res.status(200).json({ msg: "Insert successfull" })
            } catch (error) {
                await t1.rollback();
                res.status(201).json({ err: error.message });
            }
        }


        // let newAgency = new tax_offices(updateInfo);
        // newAgency.save().then(() => {
        //     res.status(200).json({ msg: "Insert successfull" })
        // })
    
    } catch (error) {
    res.status(201).json({ err: error.message });
}
}


module.exports.addUserTofficeAsStaff = async (req, res) => {
    try {
        let value = req.body
        switch (req.body.input) {

            case "addtooffice":
                // if(error){
                    // res.status(201).json({ err: error.message })
                // } else {
                    let payload = {
                        tax_office_id: value.tax_office,
                        group_id: value.group_id,
                        user_code: value.staff_numbe,
                        email: value.email,
                        username: value.email,
                        user_phone: value.user_phone,
                        name: value.name,
                        user_code: value.staff_number,
                        password: await bcrypt.hash('1234567', saltRounds)
                    }
    
                    let OfficeUser = new Users(payload);
                    OfficeUser.save().then(() => {
                        res.status(200).json({ msg: "done" })
                    })
    
                // }
               
                break;
            case "update":
                let payload12 = {
                    tax_office_id: value.tax_office,
                    group_id: value.group_id,
                    user_code: value.staff_numbe,
                    email: value.email,
                    usename: value.email,
                    user_phone: value.user_phone,
                    name: value.name,
                    user_code: value.staff_number,
                }
                await Users.update(payload12, {where:{id: value.id}}, {new:true})
                res.status(200).json({ msg: "done" })
                break;
            case "removefromoffice":
                let payload1 = {
                    tax_office_id: req.body.id,
                    group_id: req.body.grpId
                }

                let user1 = await Users.findOne({ where: { username: req.body.tin } });

                if (user1) {
                    user.update(payload1, { where: { username: req.body.tin } }, { new: true })
                    res.status(200).json({ msg: "done" })
                } else {
                    res.status(201).json({ err: "User not found" })
                }
                break;
            default:
                res.status(201).json({ err: "Invalid Request type" })
                break;
        }
    } catch (error) {
        console.log(error)
        res.status(201).json({ err: error.message })
    }
}

module.exports.viewOfficeUser = async (req, res) => {
    let officeid = req.query.office_id ? req.query.office_id : req.user.tax_office_id;
    let officeUsers = await Users.findAll({ where: { tax_office_id: officeid } });
    let offices = req.user.group_id == 111111 ? await tax_offices.findAll() : await tax_offices.findOne({ where: { tax_office_id: officeid } })
    let usergroup = await User_groups.findAll()
    res.render('./offices/view_office_users', {
        officeUsers, offices, usergroup
    })
}

module.exports.updateAgencyInfo = async (req, res) => {
    try {
        const { error, value } = validation.createUpdateAgency.validate(req.body);
        if (error) {
            res.status(201).json({ err: error.message });
        } else {
            let updateInfo = {
                tax_office: value.tax_office,
                created_by: req.user.username,
                created_at: new Date(),
                email: value.email,
                mobile_number: value.mobile_number,
                agencies_type: value.agencies_type,
                functions: value.functions,
                address: value.address,
            }
            tax_offices.update(updateInfo, { where: { id_tax_office: value.id } }).then(() => {
                res.status(200).json({ msg: "Updated" })
            })
        }
    } catch (error) {
        res.status(201).json({ err: error.message });
    }
}

module.exports.paymentByagent = async (req, res) => {
    let result = await db.query(`
        SELECT
        tax_offices.tax_office AS label, 
            sum(
                assessments.assessment_amount_paid
            ) AS y
            
        FROM
            assessments
        LEFT JOIN tax_offices ON assessments.tax_office_id = tax_offices.id_tax_office
        WHERE
            YEAR (
                assessments.assessment_date
            ) = 2022 AND assessments.settlement_status = 1
        GROUP BY
            assessments.tax_office_id`, { type: QueryTypes.SELECT });
    //    console.log(result)
    res.json(result)
}

module.exports.assessmets = async (req, res) => {
    let res2 = await db.query(`
        SELECT
        tax_offices.tax_office AS label, 
            sum(
                assessments.assessment_amount_paid
            ) AS y
            
        FROM
            assessments
        LEFT JOIN tax_offices ON assessments.tax_office_id = tax_offices.id_tax_office
        WHERE
            YEAR (
                assessments.assessment_date
            ) = 2022 
        GROUP BY
            assessments.tax_office_id`, { type: QueryTypes.SELECT });
    console.log("new ", res2)
    res.json(res2)
}


module.exports.assessmets2 = async (req, res) => {
    let result = db.query(`
        SELECT
            sum(
                assessments.assessment_amount_paid
            ) AS amt_paid,
            tax_offices.tax_office AS office
        FROM
            assessments
        LEFT JOIN tax_offices ON assessments.tax_office_id = tax_offices.id_tax_office
        WHERE
            YEAR (
                assessments.assessment_date
            ) = 2022 
        GROUP BY
            assessments.tax_office_id`, { type: QueryTypes.SELECT });

    res.json({ result })

}

module.exports.paymentByItem = async (req, res) => {
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
    AND locked = 1
    AND paid = 1
    GROUP BY
        assessment_item_invoices.assessment_item_id
    `, { type: QueryTypes.SELECT });

    res.json(result)
}


