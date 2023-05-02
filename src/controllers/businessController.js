const businessModel = require("../model/business/businessModel");
const validation = require("../config/validation");
// const { business_operations } = require("../model/business/businessModel");

exports.getBusinessSize = async (req, res) => {
  const businessSizes = await businessModel.business_sizes.findAll({
    where: { organization_id: req.user.service_id },
    raw: true,
  });
  res.status(200).render("./business/business_size", {
    businessSizes,
  });
};

// create business sizes
exports.storeBusinessSize = async (req, res) => {
  try {
    const { value, error } = validation.businessSizeV.validate(req.body);
    if (error) {
      res.status(401).json({
        status: "error",
        message: "validation error",
        error: error.message,
      });
    } else {
      await businessModel.business_sizes.create({
        business_size: value.business_size,
        organization_id: req.user.service_id,
      });

      res.status(201).json({
        status: "success",
        message: "Created",
      });
    }
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "System error",
      error: error.message,
    });
  }
};


// delete business size
exports.deleteBusinessSize = async (req, res) => {
  await businessModel.business_sizes.destroy({
    where: { business_size_id: req.params.id },
  });
  req.flash("danger", "Business Size Deleted!");
  res.redirect("back");
};

// Update business size 
exports.editBusinessSize = async (req, res) => {
  try {
    const { value, error } = validation.businessSizeV.validate(req.body);
    if (error) {
      console.log(error);
      res.status(401).json({
        status: "error",
        message: "validation error",
        error: error.message.split('"'),
      });
    } else {
      const bSize = await businessModel.business_sizes.findOne({
        where: { business_size_id: value.id },
      });
      if (bSize) {
        bSize.update({ business_size: value.business_size }, { new: true });
        res.status(200).json({
          status: "success",
          message: "Updated",
        });
      } else {
        res.status(200).json({
          status: "error",
          message: "Business type not found",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: "error",
      message: "System error",
      error: error.message,
    });
  }
};

// business operation 
exports.businessOperations = async(req, res) => {

    const businessOperation = await businessModel.business_operations.findAll({where: {service_id: req.user.service_id}, raw:true});
    const businessCategory = await businessModel.business_categories.findAll({where: {service_id: req.user.service_id}, raw:true});

    res.status(200).render('./business/business_operation', {
        businessOperation,
        businessCategory
    })

}

exports.storeBusinessOperation = async(req, res) => {
    try {
        const {value, error} = validation.businessOperationV.validate(req.body);
        if(error) {
            res.status(401).json({
              status: "error",
              message: "validation error",
              error: error.message.split('"'),
            });
        } else {
            await businessModel.business_operations.create({
              business_operation: value.business_operation,
              service_id: req.user.service_id,
              organization_id: req.user.service_id,
              business_category: value.business_category,
              created_by: req.user.usernme
            })

            res.status(200).json({
              status: "success",
              message: "Updated",
            });
        }
    } catch (error) {
      res.status(401).json({
        status: "error",
        message: "System error",
        error: error.message,
      });
    }
}

exports.updateBusinessOperation = async(req, res) => {
  try {
    console.log(req.body)
    const {value, error} = validation.businessOperationV.validate(req.body);
    if(error) {
      res.status(401).json({
        status: "error",
        message: "validation error",
        error: error.message.split('"'),
      });
    } else {
      const businessOperation = await businessModel.business_operations.findOne({where: {business_operation_id: value.id}})
      if(businessOperation){
        businessOperation.update({
          business_operation: value.business_operation,
          business_category: value.business_category,
        }, {new: true});
        res.status(200).json({
          status: "success",
          message: "Updated",
        });
      } else {
        res.status(200).json({
          status: "error",
          message: "Business type not found",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "System error",
      error: error.message,
    });
  }
}

// delete business size
exports.deleteBusinessSize = async (req, res) => {
  await businessModel.business_operations.destroy({
    where: { business_operation_id: req.params.id },
  });
  req.flash("danger", "Business Operation Deleted!");
  res.redirect("back");
};


// Business category
exports.businessCategory = async(req, res) => {
  const businessCategory = await businessModel.business_categories.findAll({where: {service_id: req.user.service_id }})

  res.status(200).render('./business/business_category', {
    businessCategory
  })
}

exports.storeBusinessCategory = async(req, res) => {
  try {
    const {value, error} = validation.businessCategoryV.validate(req.body);
    if(error) {
      res.status(401).json({
        status: "error",
        message: "validation error",
        error: error.message.split('"'),
      });
    } else {
      await businessModel.business_categories.create({
        business_category: value.business_category,
        service_id: req.user.service_id,
        organization_id: req.user.service_id,
      })

      res.status(200).json({
        status: "success",
        message: "Updated",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "System error",
      error: error.message,
    });
  }
}

exports.editBusinesscategory = async(req, res) => {
  try {
    const {value, error} = validation.businessCategoryV.validate(req.body);
    if(error) {
      res.status(401).json({
        status: "error",
        message: "validation error",
        error: error.message.split('"'),
      });
    } else {
      const bCategory = await businessModel.business_categories.findOne({where: {business_category_id: value.id}})
      if(bCategory){
        bCategory.update({business_category: value.business_category}, {new:true})
       res.status(200).json({
          status: "success",
          message: "Updated",
        });
      } else {
        res.status(200).json({
          status: "error",
          message: "Business Category not found",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "System error",
      error: error.message,
    });
  }
}

exports.deleteBuinsessCategory = async(req, res) => {
  await businessModel.business_categories.destroy({where: {business_category_id: req.params.id}});

  req.flash('success', 'Deleted');
  res.status(200).redirect('back')
}


exports.businessSector = async(req, res) => {
  const businessSector = await businessModel.business_sectors.findAll({where: {service_id: req.user.service_id}});

  res.status(200).render('./business/business_sector', {
    businessSector
  })
}

exports.storeBusinessSector = async(req, res) => {
  try {
    const {value, error } = validation.businessSectorV.validate(req.body);
    if(error) {
      res.status(401).json({
        status: "error",
        message: "validation error",
        error: error.message.split('"'),
      });
    } else {
      await businessModel.business_sectors.create({
        business_sector: value.business_sector,
        service_id: req.user.service_id,
        created_by: req.user.usernme,
        organization_id: req.user.service_id,
      })
      res.status(200).json({
        status: "success",
        message: "Updated",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "System error",
      error: error.message,
    });
  }
}

exports.editBusinessSector = async(req, res) => {
  try {
    
      const {value, error } = validation.businessSectorV.validate(req.body);
      if(error) {
        res.status(401).json({
          status: "error",
          message: "validation error",
          error: error.message.split('"'),
        });
      } else {
        const bOperation = await businessModel.business_sectors.findOne({where: {business_sector_id: value.id}})
        if(bOperation) {
          bOperation.update({business_sector: value.business_sector}, {new:true});
          res.status(200).json({
            status: "success",
            message: "Updated",
          });
        } else {
          res.status(200).json({
            status: "error",
            message: "Business Sector not found",
          });
        }
        
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "System error",
        error: error.message,
      });
    }
}

exports.deleteBuinsessSector = async(req, res) => {
  await businessModel.business_sectors.destroy({where: {business_sector_id: req.params.id}})
  req.flash('success', 'Deleted');
  res.status(200).redirect('back')
}