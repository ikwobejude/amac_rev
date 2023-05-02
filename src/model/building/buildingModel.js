const Sequelize = require('sequelize');
const db = require('../../db/db');


const buildings = db.define('_buildings', {
    idbuilding:{
        type: Sequelize.INTEGER(20),
        autoIncrement: true,
        primaryKey: true,
        allowNull : true
    },
    building_number: {type: Sequelize.STRING},
    building_name: {type: Sequelize.STRING},
    building_image: {type: Sequelize.BLOB},
    building_category_id: {type: Sequelize.STRING},
    ward: {type: Sequelize.INTEGER},
    lga: {type: Sequelize.INTEGER},
    street_id: {type: Sequelize.INTEGER},
    state_id: {type: Sequelize.INTEGER},
    service_id: {type: Sequelize.STRING},
    authorization_id: {type: Sequelize.STRING},
    session_id: {type: Sequelize.STRING},
    latitude: {type: Sequelize.STRING},
    longitude: {type: Sequelize.STRING},
    building_id: {type: Sequelize.STRING},
    status: {type: Sequelize.TINYINT},
    registered_by: {type: Sequelize.STRING},
    registered_on: {type: Sequelize.DATE},
    last_disabled_by: {type: Sequelize.STRING},
    last_disabled_on: {type: Sequelize.DATE},
    last_disable_reason: {type: Sequelize.STRING},
    last_enabled_by: {type: Sequelize.STRING},
    last_enabled_on: {type: Sequelize.DATE},
    last_enable_reason: {type: Sequelize.STRING},
    owner_name: {type: Sequelize.STRING},
    owner_email: {type: Sequelize.STRING},
    owner_mobile_no: {type: Sequelize.STRING},
    apartment_type: {type: Sequelize.STRING},
    apartment_count: {type: Sequelize.INTEGER},
    property_id: {type: Sequelize.STRING},
    no_of_apartments: {type: Sequelize.STRING},
    sync: {type: Sequelize.TINYINT},
    tax_office_id: {type: Sequelize.STRING},
},{
    timestamps : false,
    freezeTableName: true,
});



const building_categories = db.define('_building_categories', {
    idbuilding_category:{
        type: Sequelize.INTEGER(20),
        autoIncrement: true,
        primaryKey: true,
        allowNull : true
    },
    building_category: {type: Sequelize.STRING}
},{
    timestamps : false,
    freezeTableName: true,
});

const building_types = db.define('building_types', {
    building_type_id:{
        type: Sequelize.INTEGER(20),
        autoIncrement: true,
        primaryKey: true,
        allowNull : true
    },
    building_type: {type: Sequelize.STRING},
    organization_id: {type: Sequelize.STRING},
},{
    timestamps : false,
    freezeTableName: true,
});


// buildings.HasOne(building_categories, {foreignKey: 'idbuilding_category'})
// building_categories.belongsTo(buildings, { foreignKey: 'building_category_id', targetKey:'idbuilding_category' })


module.exports ={
    buildings, building_categories,building_types
}




