const { assessmentItems } = require("../config/validation");
const { assessment_items } = require("../model/assessmentModels")



const handleError = (err) => {
    return err;
}


module.exports.assessmentItem = async (req, res) => {

    let items = await assessment_items.findAll();
    res.render('./admin/items/view_assessment_items', {
        items
    })

}


module.exports.createAssItem = async (req, res) => {
    try {
        const { error, value } = assessmentItems.validate(req.body);
        if (error) {
            let err = handleError(error)
            res.status(201).json({ "err": err.message })
        } else {
            let inputs = {
                // assessment_group: value.assessment_group,
                assessment_item_name: value.assessment_item_name,
                tax_base_amount: value.tax_base_amount,
                service_id: req.user.service_id,
                created_by: req.user.username,
                created_at: now.Date()
            }

            let newItem = new assessment_items(inputs);
            newItem.save().then(() => {
                res.status(200).json({ s: "Assessment Item Created" })
            })
        }

    } catch (error) {
        let err = handleError(error)
        res.status(201).json({ "err": err.message })
    }
}

module.exports.updateAssItems = async(req, res) => {
    try {
        assessment_items.update(values, {where:{assessment_item_id: assessment_item_id}})
        .then(() => {
            res.status(200).json({ msg: "Assessment Item Updated" })
        })
    } catch (error) {
        res.status(201).json({ msg: error.message })
    }
}

module.exports.deleteAssItems = async(req, res) => {
    try {
        assessment_items.destroy({where:{assessment_item_id: assessment_item_id}})
        .then(() => {
            res.status(200).json({ msg: "Assessment Item Deleted" })
        })
    } catch (error) {
        res.status(201).json({ msg: error.message })
    }
}





async function findAssassmentItem(id){

}