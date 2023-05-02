const validation = require("../config/validation");
const buildingModel = require("../model/building/buildingModel")

exports.buildingTypes = async(req, res) => {
    const buildingType = await buildingModel.building_types.findAll({where: {organization_id: req.user.service_id}, raw:true});

    res.status(200).render('./building/building_type', {
        buildingType 
    })
}

exports.createBuildingType = async(req, res) => {
    try {
        const {value, error} = validation.buildingTypeV.validate(req.body)
        if(error){
            res.status(401).json({
                status: 'error',
                message: 'validation error',
                error: error.message
            })
        } else {
            const bType = await buildingModel.building_types.create({
                building_type: value.building_type,
                organization_id: req.user.service_id
            });

            res.status(201).json({
                status: 'success',
                message: 'Created',
                data: bType
            })
        }
    } catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'System error',
            error: error.message
        })
    }
}

exports.deleteBuildingType = async(req, res) => {
    await buildingModel.building_types.destroy({where: {building_type_id: req.params.id}});
    req.flash('danger', 'Business type deleted!');
    res.redirect('back');
}

exports.updateBusinessType = async(req, res) => {
    try {
        console.log(req.body)
        const {value, error} = validation.buildingTypeV.validate(req.body)
        if(error){
            console.log(error)
            res.status(401).json({
                status: 'error',
                message: 'validation error',
                error: error.message.split('"')
            })
        } else {
            const bType = await buildingModel.building_types.findOne({where: {building_type_id: value.id}});
            if(bType){
                bType.update({building_type: value.building_type}, {new:true});
                res.status(200).json({
                    status: 'success',
                    message: 'Updated'
                })
            } else {
                res.status(200).json({
                    status: 'error',
                    message: 'Business type not found',
                })
            }

           
        }
    } catch (error) {
        console.log(error)
        res.status(401).json({
            status: 'error',
            message: 'System error',
            error: error.message
        })
    }
}