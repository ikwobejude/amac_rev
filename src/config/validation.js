const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity");

exports. complexityOptions = {
    min: 6,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,
};

exports. valideteUsersignup = Joi.object({
    name: Joi.string().required(),
    // username: Joi.string().alphanum().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    email: Joi.string().email().required(),
    user_phone: Joi.number().integer().min(10).required()
})


exports. loginUser = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),

})

exports. validateTin = Joi.object({
    tin: Joi.number().integer().required()
})

exports. createTinAndAccount = Joi.object({
    usertype: Joi.string(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    number: Joi.number().integer().min(10).required(),
    state: Joi.number().integer().required(),
    lga_id: Joi.number().integer().required(),
    password1: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    password2: Joi.ref('password1')
})


exports. TaxTin = Joi.object({
    tax_payer_tin: Joi.number().integer().required()
})

exports. initialPayment = Joi.object({
    tin: Joi.number().integer().required(),
    paymentReference: Joi.string().required(),
    paymentItem: Joi.string(),
    amount: Joi.number().precision(2).required(),
    callBackUrl: Joi.string().required()
})



exports. assessmentItems = Joi.object({
    // asessment_group: Joi.string().required(),
    assessment_item_name: Joi.string().required(),
    tax_base_amount: Joi.number().precision(2).required(),
})

exports. validOtp = Joi.object({
    otp: Joi.number().integer().required()
})

exports. resetPwd = Joi.object({
    otp: Joi.number().integer().required(),
    password1: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    password2: Joi.ref('password1')
})


exports. createUpdateAgency = Joi.object({
    tax_office: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile_number: Joi.number().integer().min(11).required(),
    agencies_type: Joi.string(),
    functions: Joi.string(),
    address: Joi.string(),
    id: Joi.string()
})

exports. officeV = Joi.object({
    tax_office: Joi.string().required(),
    email: Joi.string().email().required(),
    user_phone: Joi.string().min(11).required(),

    address: Joi.string()
})

exports. verifyPaymentInvo = Joi.object({
    invoice: Joi.string().required()
});


exports. paymentData = Joi.object({
    name: Joi.string().required(),
    card: Joi.string().creditCard().required(),
    card_month: Joi.number().required(),
    vard_year: Joi.number().required(),
    cvv: Joi.number().required(),
    invoice: Joi.string().required(),
    amount: Joi.number()
})


exports. agencyType = Joi.object({
    agency_type: Joi.string().required()
})

exports. agenciesv = Joi.object({
    agency_type: Joi.string().required(),
    agency_name: Joi.string().required(),
    agency_email: Joi.string().email().required(),
    agency_phone: Joi.string().min(10).required(),
    id: Joi.string().required(),
})

exports. officeUserV = Joi.object({
    name: Joi.string().required(),
    tax_office: Joi.string().required(),
    staff_number: Joi.number().integer().required(),
    email: Joi.string().email().required(),
    user_phone: Joi.number().integer().required(),
    group_id: Joi.string().required(),
    input: Joi.string()
})



exports.taxitems = Joi.object({
    taxitem: Joi.array().items(Joi.string()).required(),
    business_tag: Joi.string().required(),
})


exports.itemsBuilding = Joi.object({
    taxitem: Joi.array().items(Joi.string()).required(),
    building_number: Joi.string().required(),
})

exports.buildingTypeV = Joi.object({
    building_type: Joi.string().required(),
    id:Joi.string().required(),
});


exports.createBuildings = Joi.object({
    building_number:   Joi.string().required(),
    building_name:  Joi.string().required(), 
    building_image:   Joi.string().allow("").optional(),
    building_category_id :  Joi.string().required(),
    street_id :  Joi.string().required(),
    state_id :  Joi.string().required(),
    latitude :  Joi.string().required(),
    longitude :  Joi.string().required(),
    owner_name :  Joi.string().required(),
    owner_email :  Joi.string().required(),
    owner_mobile_no :  Joi.string().required(),
    apartment_type :  Joi.string().required(),
    apartment_count :  Joi.string().allow("").optional(),
    no_of_apartments :  Joi.string().required(),
    lga: Joi.string().required(),
    ward: Joi.string().required(),
})

exports.businessSizeV = Joi.object({
    business_size: Joi.string().required(),
    id:Joi.string().allow("").optional(),
});


exports.businessOperationV = Joi.object({
    business_operation: Joi.string().required(),
    id:Joi.string().allow("").optional(),
    business_category: Joi.string().required(),
})

exports.businessCategoryV = Joi.object({
    business_category: Joi.string().required(),
    id:Joi.string().allow("").optional(),
});


exports.businessSectorV = Joi.object({
    business_sector: Joi.string().required(),
    id:Joi.string().allow("").optional(),
});

