const Sequelize = require('sequelize');
const db = require('../db/db');

const tax_payer_items = db.define('tax_payer_items', {
    tax_payer_items_id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    tax_id: {
        type: Sequelize.STRING(200)
    },
    revenue_name: {
        type: Sequelize.STRING
    },
    revenue_id: {
        type: Sequelize.INTEGER(11),
    },
    date_logged: {
        type: Sequelize.DATE
    },
    registered_by: {
        type: Sequelize.STRING(255)
    },
    service_id: {
        type: Sequelize.STRING(150)
    },
    approved: {
        type: Sequelize.TINYINT(1),
        allowNull: true
    },
    approved_date: {
        type: Sequelize.DATE
    },
    approved_by: {
        type: Sequelize.STRING(255)
    },
    approved_date: {
        type: Sequelize.DATE
    },
    authorized: {
        type: Sequelize.TINYINT(1),
        allowNull: true
    },
    authorized_date: {
        type: Sequelize.DATE
    },
    authorized_by: {
        type: Sequelize.STRING(255)
    },
    taxpayer_name: {
        type: Sequelize.STRING(255)
    },
    street_id: {
        type: Sequelize.INTEGER(11)
    },
    city_id: {
        type: Sequelize.INTEGER(11)
    },
    test_id: {
        type: Sequelize.INTEGER(11)
    },
    revenue_amount: {
        type: Sequelize.DECIMAL(50),
        decimals: 2
    }
}, {
    timestamps: false,
    freezeTableName: true,
});


const tax_payers = db.define('tax_payers', {
    taxpayer_id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
    },
    taxpayer_rin: {
        type: Sequelize.STRING(50)
    },
    taxpayer_name: {
        type: Sequelize.STRING(50)
    },
    taxpayer_tin: {
        type: Sequelize.STRING(50)
    },
    mobile_number: {
        type: Sequelize.STRING(50)
    },
    email_addresss: {
        type: Sequelize.STRING(50)
    },
    tax_office: {
        type: Sequelize.STRING(50)
    },
    tax_payer_type: {
        type: Sequelize.STRING(50)
    },
    economic_activity: {
        type: Sequelize.STRING(50)
    },
    preferred_notification_method: {
        type: Sequelize.STRING(50)
    },
    tax_payer_status: {
        type: Sequelize.STRING(50)
    },
    account_balance: {
        type: Sequelize.STRING(50)
    },
    service_id: {
        type: Sequelize.STRING(200)
    },
    passwordr: {
        type: Sequelize.STRING(200)
    },
    contactaddress: {
        type: Sequelize.TEXT
    },
    organization_id: {
        type: Sequelize.STRING(150)
    },
    photo_url: {
        type: Sequelize.STRING
    },
    rcc: {
        type: Sequelize.STRING(30)
    },
    bvn: {
        type: Sequelize.STRING(30)
    },
    bvn: {
        type: Sequelize.STRING(30)
    },
    nin: {
        type: Sequelize.STRING
    },

}, {
    timestamps: false,
    freezeTableName: true,
});

const local_government_area = db.define('local_goverment_area', {
    id_lga: {
        type: Sequelize.BIGINT(20),
        primaryKey: true,
        autoIncrement: true,
        allowNull: true
    },
    lga_id:{type: Sequelize.BIGINT(20)},
    lga: {
        type: Sequelize.STRING(50),
    },
    lga_code: {
        type: Sequelize.STRING
    },
    state_id: {
        type: Sequelize.BIGINT(20),
    }
}, {
    timestamps: false,
    freezeTableName: true
});

const _countries = db.define('countries', {
    country_id: {
        type: Sequelize.BIGINT(20),
        primaryKey: true,
        autoIncrement: true,
        allowNull: true
    },
    country: {
        type: Sequelize.STRING(45),
    },
    country_code: {
        type: Sequelize.STRING(45)
    },
}
    , {
        timestamps: false
    });

const _cities = db.define('_cities', {
    city_id: {
        type: Sequelize.BIGINT(20),
        primaryKey: true,
        autoIncrement: true,
        allowNull: true
    },
    city: {
        type: Sequelize.STRING(45),
    },
    city_code: {
        type: Sequelize.STRING(45)
    },
    lga_id: {
        type: Sequelize.BIGINT(20),
    },
    created_at: {
        type: Sequelize.DATE,
    },
    updated_at: {
        type: Sequelize.DATE,
    }
}, {
    timestamps: false
});

const Signature = db.define('signature', {
    signature_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: true
    },
    OfficersName: {
        type: Sequelize.STRING(255),
    },
    OfficersDesign: {
        type: Sequelize.STRING(255)
    },
    area_council: {
        type: Sequelize.STRING(255)
    },
    OfficersSign: {
        type: Sequelize.STRING(255)
    },
    position: {
        type: Sequelize.STRING(255)
    },
    service_id: {
        type: Sequelize.STRING(255)
    }
}
    , {
        timestamps: false,
        freezeTableName: true
    });

const _street = db.define('_streets', {
    idstreet: {
        type: Sequelize.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: true
    },
    street: {
        type: Sequelize.STRING(55)
    },
    ward_id: {
        type: Sequelize.BIGINT(12)
    },
    city_id: {
        type: Sequelize.BIGINT(12)
    },
    latitude: {
        type: Sequelize.STRING(35)
    },
    longitude: {
        type: Sequelize.STRING(35)
    },
    street_id: {
        type: Sequelize.BIGINT(11)
    },
    service_id: {
        type: Sequelize.STRING(255)
    },
    status: {
        type: Sequelize.TINYINT(1)
    },
    area_id:{
        type: Sequelize.STRING(100)
    }


}, {
    timestamps: false,
    freezeTableName: true
})

const states = db.define('states', {
    id: {
        type: Sequelize.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: true
    },
    name:{type: Sequelize.STRING(100)},
    abbreviation:{type: Sequelize.STRING(100)},
    code:{type: Sequelize.STRING(100)},
    country:{type: Sequelize.STRING(100)},
}, {
    timestamps: false,
    freezeTableName: true
})

const agencies = db.define('agencies', {
    agency_id: {
        type: Sequelize.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: true
    },
    agency_type: { type: Sequelize.STRING(100) },
    agency_name: { type: Sequelize.STRING(100) },
    service_id: { type: Sequelize.STRING(100) },
    created_by: { type: Sequelize.STRING(100) },
    created_at: { type: Sequelize.DATE },
    updated_by: { type: Sequelize.STRING(100) },
    updated_at: { type: Sequelize.DATE },
    organization_id: { type: Sequelize.STRING(100) },
    agency_email: { type: Sequelize.STRING(100) },
    agency_phone: { type: Sequelize.STRING(100) },
}, {
    timestamps: false,
    freezeTableName: true
})


const agency_types = db.define('agency_types', {
    agency_type_id: {
        type: Sequelize.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: true
    },
    agency_type: { type: Sequelize.STRING(100) },
    service_id: { type: Sequelize.STRING(100) },
    created_by: { type: Sequelize.STRING(100) },
    created_at: { type: Sequelize.DATE },
    updated_by: { type: Sequelize.STRING(100) },
    updated_at: { type: Sequelize.DATE },
    organization_id: { type: Sequelize.STRING(100) },
}, {
    timestamps: false,
    freezeTableName: true
})


const agent_assessments = db.define('agent_assessments', {
    agent_assessment_id: {
        type: Sequelize.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: true
    },
    agent_assessment_ref: { type: Sequelize.STRING(100) },
    agent_rin: { type: Sequelize.STRING(100) },
    taxpayer_rin: { type: Sequelize.STRING(100) },
    taxpayer_name: { type: Sequelize.STRING(100) },
    assessment_item: { type: Sequelize.STRING(100) },
    gross_amount: { type: Sequelize.DECIMAL(50, 2) },
    transacton_description: { type: Sequelize.TEXT },
    transaction_date: { type: Sequelize.DATE },
    assessment_month: { type: Sequelize.STRING(100) },
    assessment_year: { type: Sequelize.INTEGER(5) },
    batchnumber: { type: Sequelize.STRING },
    assessment_rule: { type: Sequelize.STRING },
    service_id: { type: Sequelize.STRING(150) },
    authorized: { type: Sequelize.TINYINT(1) },
    authorized_by: { type: Sequelize.STRING(100) },
    authorized_on: { type: Sequelize.DATEONLY },
    assessed_amount: { type: Sequelize.DECIMAL(50, 2) },
    asset_type: { type: Sequelize.STRING(100) },
    asset_rin: { type: Sequelize.STRING(100) },
    profile_ref: { type: Sequelize.STRING(100) },
    rule_code: { type: Sequelize.STRING(100) },
    entered_by: { type: Sequelize.STRING(100) },
    date_entered: { type: Sequelize.DATE },
    cancelled: { type: Sequelize.TINYINT(1) },
    settlement_status : { type: Sequelize.TINYINT(1) },
    settlement_date : { type: Sequelize.DATE },
    agency_reference:{ type: Sequelize.STRING(100) },
    invoice_number:{ type: Sequelize.STRING(100) },
    amount: { type: Sequelize.DECIMAL(50, 2) }
}, {
    timestamps: false,
    freezeTableName: true
})

const wards = db.define('wards', {
    ward_id: {
        type: Sequelize.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: true
    },
    ward: { type: Sequelize.STRING(100) },
    lga: { type: Sequelize.STRING(100) },
    created_by: { type: Sequelize.STRING(100) },
    created_at: { type: Sequelize.DATE },
    updated_by: { type: Sequelize.STRING(100) },
    updated_at: { type: Sequelize.DATE },
    lga_id: { type: Sequelize.INTEGER },
    service_id: { type: Sequelize.STRING },
    organization_id: { type: Sequelize.STRING },
    ward_code: { type: Sequelize.STRING },
    
}, {
    timestamps: false,
    freezeTableName: true
})

module.exports = {
    tax_payer_items,
    tax_payers,
    local_government_area,
    _cities,
    _countries,
    Signature, 
    _street, 
    states, 
    agencies, 
    agent_assessments, 
    agency_types, 
    wards
}
