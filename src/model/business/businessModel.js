const Sequelize = require('sequelize');
const db = require('../../db/db');

//busineses model start
const businesses = db.define('businesses',{
    business_id:{
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        allowNull : true
    },
    id_business:{
        type: Sequelize.STRING(45)
    },
    business_rin:{
        type: Sequelize.STRING(255)
    },
    business_type:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    asset_type:{
        type: Sequelize.STRING(255),
        allowNull: true
    },
    business_name:{
        type: Sequelize.STRING(255)
    },
    business_lga:{
        type: Sequelize.STRING(45)
    },
    business_category:{
        type: Sequelize.STRING(50)
    },
    business_sector:{
        type: Sequelize.STRING(50)
    },
    business_sub_sector:{
        type: Sequelize.STRING(50)
    },
    business_structure:{
        type: Sequelize.STRING(50)
    },
    business_operation:{
        type: Sequelize.STRING(50)
    },
    Profile_ref:{
        type: Sequelize.STRING(100)
    },
    Status:{
        type: Sequelize.STRING(40),
        allowNull: true
    },
    service_id:{
        type: Sequelize.STRING(100),
        allowNull: true
    },
    created_at:{
        type: Sequelize.DATE
    },
    updated_by:{
        type: Sequelize.STRING
    },
    updated_at:{
        type: Sequelize.DATE
    },
    tax_id:{
        type: Sequelize.INTEGER(11)
    },
    taxpayer_rin:{
        type: Sequelize.STRING(50)
    },
    system_business_rin:{
        type: Sequelize.STRING
    },
    business_size:{
        type: Sequelize.STRING    
    },
    business_address:{
        type: Sequelize.TEXT
    },
    contact_person:{
        type: Sequelize.STRING
    },
    businessnumber:{
        type: Sequelize.STRING
    },
    business_email:{
        type: Sequelize.STRING(50)
    },
    passwordr:{
        type: Sequelize.STRING(100) 
    },
    photo_url:{
        type: Sequelize.TEXT
    },
    apartment_id:{
        type: Sequelize.STRING(110),
        allowNull: true   
    },
    building_id:{
        type: Sequelize.STRING(110)  
    },
    organization_id:{
        type: Sequelize.STRING(110) 
    },
    tax_office_id:{
        type: Sequelize.INTEGER(11)
    },
    business_ownership:{
        type: Sequelize.STRING(50)
    },
    ward_id:{ type: Sequelize.INTEGER(11)  },
    business_street_id:{ type: Sequelize.INTEGER(11)  },
    business_tag:{
        type: Sequelize.STRING(255)
    },
    business_street: {type: Sequelize.STRING},
    sync: {type: Sequelize.TINYINT(1)}
},{
    timestamps : false,
    freezeTableName: true,
});

const _building_types = db.define('_building_types',{
    building_type_id :{
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull : true
    },
    building_type:{
        type: Sequelize.STRING
    },
    organization_id:{
        type: Sequelize.STRING
    },
    
},{
    timestamps : false,
    freezeTableName: true,
});

const business_categories = db.define('business_categories',{
    business_category_id :{
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull : true
    },
    business_category:{type: Sequelize.STRING},
    service_id:{type: Sequelize.STRING},
    created_by:{type: Sequelize.STRING},
    created_at:{type: Sequelize.DATEONLY},
    updated_by:{type: Sequelize.STRING},
    updated_at:{type: Sequelize.DATEONLY},
    organization_id:{type: Sequelize.STRING}
},{
    timestamps : false,
    freezeTableName: true,
});


const tax_items = db.define('tax_items', {
    idtax :{
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull : true
    },
    taxcode:{type: Sequelize.STRING},
    taxitem:{type: Sequelize.STRING},
    amount:{type: Sequelize.STRING},
    business_tag:{type: Sequelize.STRING},
    taxyear:{type: Sequelize.STRING},
    created_on:{type: Sequelize.DATE},
    revenue_code:{type: Sequelize.STRING},
    type:{type: Sequelize.STRING},
    service_id:{type: Sequelize.STRING},
    tax_office:{type: Sequelize.STRING},
    invoice_number:{type: Sequelize.STRING},
    payment_status:{type: Sequelize.TINYINT},
    discount:{type: Sequelize.DECIMAL},
    batch:{type: Sequelize.STRING},
    firstlevel:{type: Sequelize.TINYINT},
    secondlevel:{type: Sequelize.TINYINT},
    thirdlevel:{type: Sequelize.TINYINT},
},{
    timestamps : false,
    freezeTableName: true,
});

const business_operations = db.define('business_operations',{
    business_operation_id :{
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull : true
    },
    business_operation:{type: Sequelize.STRING},
    service_id:{type: Sequelize.STRING},
    created_by:{type: Sequelize.STRING},
    created_at:{type: Sequelize.DATEONLY},
    updated_by:{type: Sequelize.STRING},
    updated_at:{type: Sequelize.DATEONLY},
    organization_id:{type: Sequelize.STRING},
    business_category:{type: Sequelize.STRING},
},{
    timestamps : false,
    freezeTableName: true,
});

const business_sectors = db.define('business_sectors',{
    business_sector_id :{
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull : true
    },
    business_sector:{type: Sequelize.STRING},
    service_id:{type: Sequelize.STRING},
    created_by:{type: Sequelize.STRING},
    created_at:{type: Sequelize.DATEONLY},
    updated_by:{type: Sequelize.STRING},
    updated_at:{type: Sequelize.DATEONLY},
    organization_id:{type: Sequelize.STRING}
},{
    timestamps : false,
    freezeTableName: true,
});


const business_sizes = db.define('business_sizes',{
    business_size_id :{
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull : true
    },
    business_size:{type: Sequelize.STRING},
    created_by:{type: Sequelize.STRING},
    created_at:{type: Sequelize.DATEONLY},
    updated_by:{type: Sequelize.STRING},
    updated_at:{type: Sequelize.DATEONLY},
    organization_id:{type: Sequelize.STRING}
},{
    timestamps : false,
    freezeTableName: true,
});

const business_types = db.define('business_types',{
    business_type_id :{
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull : true
    },
    business_type:{type: Sequelize.STRING},
    service_id:{type: Sequelize.STRING},
    created_by:{type: Sequelize.STRING},
    created_at:{type: Sequelize.DATEONLY},
    updated_by:{type: Sequelize.STRING},
    updated_at:{type: Sequelize.DATEONLY},
    organization_id:{type: Sequelize.STRING}
},{
    timestamps : false,
    freezeTableName: true,
});


//exporting all the model 
module.exports = {
    businesses,
    business_operations,
    business_sectors,
    business_types,
    business_sizes,
    business_categories,
    tax_items
}