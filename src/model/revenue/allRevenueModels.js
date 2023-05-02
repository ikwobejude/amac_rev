const Sequelize = require('sequelize');
const db = require('../../db/db');
const otherTableModels = require('../others/otherTableModels');


const revenue_categories = db.define('revenue_categories',{
    revenue_category_id:{
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        allowNull : true
    },
    revenue_category:{
        type: Sequelize.STRING(45)
    },
    revenue_category_code:{
        type: Sequelize.STRING(45)
    },
    service_id:{
        type: Sequelize.STRING(150)
    },
    session_id:{
        type: Sequelize.STRING(150)
    },
    registered_by:{
        type: Sequelize.STRING(255)
    },
    registered_on:{
        type: Sequelize.DATE    
    },
    authorized_by:{
        type: Sequelize.STRING(255)
    },
    authorized_on:{
        type: Sequelize.DATE
    },
},{
    timestamps : false,
    freezeTableName: true,
});


const revenue_dimensions = db.define('revenue_dimensions',{
    revenue_dimension_id:{
        type: Sequelize.BIGINT(20),
        allowNull : true
    },
    dimension:{
        type: Sequelize.STRING(100),
        allowNull : true
    },
    dimension_code:{
        type: Sequelize.STRING(45)
    },
    service_id:{
        type: Sequelize.STRING(150)
    },
    session_id:{
        type: Sequelize.STRING(150)
    },
    registered_by:{
        type: Sequelize.STRING(255)
    },
    registered_on:{
        type: Sequelize.DATE    
    },
    authorized:{
        type: Sequelize.TINYINT(1),
        allowNull: true
    },
    authorized_by:{
        type: Sequelize.STRING(255)
    },
    authorized_on:{
        type: Sequelize.DATE
    },
    id_revenue_dimension:{
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        allowNull : true
    }
},{
    timestamps : false,
    freezeTableName: true,
});


const revenue_frequencies = db.define('revenue_frequencies',{
    revenue_frequency_id:{
        type: Sequelize.INTEGER(20),
        autoIncrement: true,
        primaryKey: true,
        allowNull : true
    },
    revenue_frequency:{
        type: Sequelize.STRING(50)
    }
},{
    timestamps : false,
    freezeTableName: true,
});

const revenues = db.define('revenues',{
      revenue_category_id:{
        type: Sequelize.INTEGER(20)
    },
    revenue_dimension_id:{
        type: Sequelize.INTEGER(20)
    },
    revenue_name:{
        type: Sequelize.STRING(150),
        allowNull: true
    },
    revenue_number:{
        type: Sequelize.STRING(50)
    },
    revenue_code:{
        type: Sequelize.STRING(50)
    },
    teller_exclude:{
        type: Sequelize.TINYINT(1),
        allowNull: true
    },
    available_for_p4me:{
        type: Sequelize.TINYINT(1),
        allowNull: true
    },
    roadtax:{
        type: Sequelize.TINYINT(1),
        allowNull: true
    },
    exclude_in_bulk_payment:{
        type: Sequelize.TINYINT(1),
        allowNull: true
    },
    lands:{
        type: Sequelize.TINYINT(1),
        allowNull: true
    },
    water_works:{
        type: Sequelize.TINYINT(1),
        allowNull: true
    },
    waste_mgt:{
        type: Sequelize.TINYINT(1),
        allowNull: true
    },
    nation_revenue:{
        type: Sequelize.TINYINT(1),
        allowNull: true
    },
    immigrations:{
        type: Sequelize.TINYINT(1),
        allowNull: true
    },
    customs:{
        type: Sequelize.TINYINT(1),
        allowNull: true
    },
    commerce:{
        type: Sequelize.TINYINT(1),
        allowNull: true
    },
    service_id:{
        type: Sequelize.STRING(45)
    },
    session_id:{
        type: Sequelize.STRING(45)
    },
    registered_by:{
        type: Sequelize.STRING(55)
    },
    registered_on:{
        type: Sequelize.DATE    
    },
    authorized_by:{
        type: Sequelize.STRING(255)
    },
    authorized_on:{
        type: Sequelize.DATE    
    },
    auto_generate_code:{
        type: Sequelize.TINYINT(1),
        allowNull: true
    },
    revenue_category_code:{
        type: Sequelize.STRING(50)
    },
    dimension_code:{
        type: Sequelize.STRING(50)
    },
    invoice_required:{
        type: Sequelize.TINYINT(1),
        allowNull: true
    },
    withholding_tax:{
        type: Sequelize.TINYINT(1),
        allowNull: true
    },
    revenue_frequency:{
        type: Sequelize.STRING(50)
    },
    assignable:{
        type: Sequelize.TINYINT(1),
        allowNull: true
    },
    fixed_rate:{
        type: Sequelize.TINYINT(1),
        allowNull: true
    },
    amount:{
        type: Sequelize.DECIMAL(50),
        decimals: 2
    },
},{
    timestamps : false,
    freezeTableName: true,
});


const RevenuesInvoices = db.define('revenue_invoices',{
    revenue_invoice_id:{
        type: Sequelize.INTEGER(20)
    },
    ref_no:{
        type: Sequelize.STRING(100),
        allowNull: true
    },
    tin:{
        type: Sequelize.STRING(45)
    },
    taxpayer_name:{
        type: Sequelize.STRING(255)
    },
    revenue_id:{
        type: Sequelize.TEXT
    },
    description:{
        type: Sequelize.TEXT
    },
    amount:{
        type: Sequelize.DECIMAL(50),
        decimals: 2,
        allowNull: true
    },
    amount_paid:{
        type: Sequelize.DECIMAL(50),
        decimals: 2,
    },
    date_log:{
        type: Sequelize.DATE
    },
    day:{
        type: Sequelize.STRING(100)
    },
    month:{
        type: Sequelize.STRING(100)
    },
    year:{
        type: Sequelize.STRING(100)
    },
    entered_by:{
        type: Sequelize.STRING(100)
    },
    invoice_number:{
        type: Sequelize.STRING(100),
        allowNull: true
    },
    paid:{
        type: Sequelize.TINYINT(1)
    },
    service_id:{
        type: Sequelize.STRING(45)
    },
    registered_by:{
        type: Sequelize.STRING(55)
    },
    registered_on:{
        type: Sequelize.DATE
    },
    source:{
        type: Sequelize.STRING(455)
    },
    zone_id:{
        type: Sequelize.STRING(115)
    },
    session_id:{
        type: Sequelize.STRING(115)
    },
    amount_remaining:{
        type: Sequelize.DECIMAL(50),
        decimals: 2,
    },
    authorized:{
        type: Sequelize.TINYINT(1)
    },
    authorized_by:{
        type: Sequelize.STRING(55)
    },
    rebet:{
        type: Sequelize.TINYINT(1)
    },
    prev_amount:{
        type: Sequelize.DECIMAL(50),
        decimals: 2,
        allowNull: true
    },
    discount: {
        type: Sequelize.DECIMAL(50),
        decimals: 2
    },
    batch: {
        type: Sequelize.STRING(50)
    },
    business_tag: { type: Sequelize.STRING(55)}
},{
    timestamps : false,
    freezeTableName: true,
});


const Revenuesettings = db.define('revenuesettings',{
    BusinessOperation:{
        type: Sequelize.STRING(250)
    },
    Maximum:{
        type: Sequelize.STRING(250)
    },
    Minimum:{
        type: Sequelize.STRING(250)
    },
    Medium:{
        type: Sequelize.STRING(250)
    },
    ExtraLarge:{
        type: Sequelize.STRING(250)
    },
    service_id:{
        type: Sequelize.STRING(250)
    },
    
},{
    timestamps : false,
    freezeTableName: true,
});

const Revenue_upload = db.define('revenue_upload',{
    id:{
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        allowNull : true
    },
    biller_accountid:{
        type: Sequelize.STRING(250)
    },
    assessment_no:{
        type: Sequelize.STRING(250)
    },
    revenue_code:{
        type: Sequelize.STRING(250)
    },
    bill_ref_no:{
        type: Sequelize.STRING(250)
    },
    name_of_business:{
        type: Sequelize.STRING(250)
    },
    address_of_property:{
        type: Sequelize.STRING(250)
    },
    type_of_property:{
        type: Sequelize.STRING(250)
    },
    annaul_value:{
        type: Sequelize.DECIMAL(50)
    },
    rate_payable:{
        type: Sequelize.DECIMAL(50)
    },
    arrears:{
        type: Sequelize.DECIMAL(50)
    },
    grand_total:{
        type: Sequelize.DECIMAL(50)
    },
    remark:{
        type: Sequelize.STRING(250)
    },
    service_id:{
        type: Sequelize.STRING(250) 
    },
    rate_year:{
        type: Sequelize.STRING(100)
    },
    rate_district:{
        type: Sequelize.STRING(255)
    },
    previous_balance:{
        type: Sequelize.DECIMAL(50)
    },
    penalty:{
        type: Sequelize.STRING(100)
    },
    goodwill:{
        type: Sequelize.DECIMAL(50)
    },
    payment_status:{
        type: Sequelize.TINYINT(1),
        defaultValue: "0",
    },
    date_uploaded:{
        type: Sequelize.DATE
    },
    phone_number:{
        type: Sequelize.STRING(20)
    },
    invoice_status:{
        type: Sequelize.TINYINT(1)
    },
    ass_status:{
        type: Sequelize.TINYINT(1)
    },
    state_tin:{
        type: Sequelize.STRING(50)
    },
    invoice:{
        type: Sequelize.STRING(50)
    },
    generated_phone:{
        type: Sequelize.STRING(20),
    },
    premises_inspection:{
        type: Sequelize.DECIMAL(50),
        defaultValue: "0.00",
    },
    shop_rate:{
        type: Sequelize.DECIMAL(50),
        defaultValue: "0.00",
    },
    sign_post:{
        type: Sequelize.DECIMAL(50),
        defaultValue: "0.00",
    },
    category:{
        type: Sequelize.STRING(100)
    },
    tax_office_id: {
        type: Sequelize.STRING
    },
    amount_paid: {
        type: Sequelize.DECIMAL(50),
        defaultValue: "0.00",
    },
    payment_date: {type: Sequelize.DATE,},
    street:{type: Sequelize.STRING},
    batch:{type: Sequelize.STRING},
    market:{type: Sequelize.STRING},
    cda:{type: Sequelize.STRING},
    street_naming:{type: Sequelize.STRING},
    updated_on: { type: Sequelize.DATE},
    updated_by: {type: Sequelize.STRING},
    image_url: {type: Sequelize.STRING},
    email: {type: Sequelize.STRING},
},{
    timestamps : false,
    freezeTableName: true,
});



const Revenue_disc = db.define('revenue_discount',{
    id:{
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        allowNull : true
    },
    business_tin:{
        type: Sequelize.STRING(250)
    },
    year:{
        type: Sequelize.STRING(250)
    },
    discount_amount:{
        type: Sequelize.DECIMAL(50)
    },
    date:{
        type: Sequelize.DATE
    },
    discountered_by:{
        type: Sequelize.STRING(250)
    },
    service_id: {
        type: Sequelize.STRING(50)
    },
    idinvoice: {type: Sequelize.INTEGER(11)}
},{
    timestamps : false,
    freezeTableName: true,
});

const smslogs = db.define('smslogs', {
    smsid:{
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        allowNull : true
    },
    phonenumber:{
        type: Sequelize.STRING(250)
    },
    message:{
        type: Sequelize.STRING(250)
    },
    batch:{
        type: Sequelize.STRING(250)
    },
    logdate:{
        type: Sequelize.DATE
    },
    service_code: {
        type: Sequelize.STRING(250)
    },
    service_id: {
        type: Sequelize.STRING(250)
    },
    sentby: {
        type: Sequelize.STRING(250)
    }
},{
    timestamps : false,
    freezeTableName: true,
});
otherTableModels.tax_offices.hasMany(Revenue_upload,  {
    foreignKey: 'tax_office_id'
  });
Revenue_upload.belongsTo(otherTableModels.tax_offices, { foreignKey: 'tax_office_id', targetKey:'tax_office_id' });
// Sequelize.sync({alter: true})

module.exports = {
    revenue_categories,
    revenue_dimensions,
    revenue_frequencies,
    RevenuesInvoices,
    revenues,
    Revenuesettings,
    Revenue_upload,
    // revenue_item,
    Revenue_disc,
    smslogs
}