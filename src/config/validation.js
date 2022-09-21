const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
    min: 6,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,
};

const valideteUsersignup = Joi.object({
    name: Joi.string().required(),
    // username: Joi.string().alphanum().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    email: Joi.string().email().required(),
    user_phone: Joi.number().integer().min(10).required()
})


const loginUser = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),

})

const validateTin = Joi.object({
    tin: Joi.number().integer().required()
})

const createTinAndAccount = Joi.object({
    usertype: Joi.string(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    number: Joi.number().integer().min(10).required(),
    state: Joi.number().integer().required(),
    lga_id: Joi.number().integer().required(),
    password1: passwordComplexity(complexityOptions),
    password2: Joi.ref('password1')
})


const TaxTin = Joi.object({
    tax_payer_tin: Joi.number().integer().required()
})

const initialPayment = Joi.object({
    tin: Joi.number().integer().required(),
    paymentReference: Joi.string().required(),
    paymentItem: Joi.string(),
    amount: Joi.number().precision(2).required(),
    callBackUrl: Joi.string().required()
})



const assessmentItems = Joi.object({
    // asessment_group: Joi.string().required(),
    assessment_item_name: Joi.string().required(),
    tax_base_amount: Joi.number().precision(2).required(),
})

const validOtp = Joi.object({
    otp: Joi.number().integer().required()
})

const resetPwd = Joi.object({
    otp: Joi.number().integer().required(),
    password1: passwordComplexity(complexityOptions),
    password2: Joi.ref('password1')
})


const createUpdateAgency = Joi.object({
    tax_office: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile_number: Joi.number().integer().min(11).required(),
    agencies_type: Joi.string(),
    functions: Joi.string(),
    address: Joi.string(),
    id: Joi.string()
})

const officeV = Joi.object({
    tax_office: Joi.string().required(),
    email: Joi.string().email().required(),
    user_phone: Joi.string().min(11).required(),

    address: Joi.string()
})

const verifyPaymentInvo = Joi.object({
    invoice: Joi.string().required()
});


const paymentData = Joi.object({
    name: Joi.string().required(),
    card: Joi.string().creditCard().required(),
    card_month: Joi.number().required(),
    vard_year: Joi.number().required(),
    cvv: Joi.number().required(),
    invoice: Joi.string().required(),
    amount: Joi.number()
})


const agencyType = Joi.object({
    agency_type: Joi.string().required()
})

const agenciesv = Joi.object({
    agency_type: Joi.string().required(),
    agency_name: Joi.string().required(),
    agency_email: Joi.string().email().required(),
    agency_phone: Joi.string().min(10).required(),
    id: Joi.string().required(),
})

const officeUserV = Joi.object({
    name: Joi.string().required(),
    tax_office: Joi.string().required(),
    staff_number: Joi.number().integer().required(),
    email: Joi.string().email().required(),
    user_phone: Joi.number().integer().required(),
    group_id: Joi.string().required(),
    input: Joi.string()
})

module.exports = {
    valideteUsersignup,
    loginUser,
    validateTin,
    createTinAndAccount,
    TaxTin,
    initialPayment,
    assessmentItems,
    validOtp,
    resetPwd,
    createUpdateAgency,
    verifyPaymentInvo,
    paymentData,
    agencyType,
    agenciesv,
    officeV,
    officeUserV
}