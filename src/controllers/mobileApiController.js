const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const validation = require('../config/validation');
const buildingModel = require('../model/building/buildingModel');
const businessModel = require('../model/business/businessModel');
const assessmentModels = require('../model/assessmentModels');
const userModel = require('../model/userModel');
const helper = require('../helper/helper');

exports.mobileAuth = async(req, res, next)=> {
    try {
    //     let token = req.headers
    //     console.log(req.headers.authorization)
        const token = req.headers.authorization.split(" ")[1];
        // console.log(token);
        if (token) {
            jwt.verify(token, process.env.JWT_SECRECT, async(err, decodedToken) => {
                if (err) {
                    res.status(401).json({
                        status: "error",
                        message: err.message
                    })
                } else {
                    let user = await userModel.Users.findOne({
                        attributes:["id", 'group_id', "name", "email", "user_phone", "service_id", "service_code"],
                        where:{id: decodedToken.id}
                    })
                    req.mobileUser = user;
                    next()
                }   
            })
        } else {
            res.status(401).json({
                status: "error",
                message: "authorization token not found!"
            })
        }  


    } catch (error) {
        // console.log(error.stack)
        res.status(401).json({
            status: "error",
            message: "Unknown error",
            data: error.message
        })
    }
   
}

exports.APIlogin = async (req, res) => {
    try {
        const { error, value } = validation.loginUser.validate(req.body)
        if (error) {
            // let err = handleError(error)
            res.status(403).json({ 
                status:"error",
                message: "validation error",
                data:  error.message.split('"').join('')
            })
        } else {
            const userInfo = await findUser(value.username, value.password);
            const token = helper.createTokeMobile(userInfo.id);
            // res.cookie('jwt', token, { httpOnly: true, masAge: masAge * 1000 })
           
                res.status(200).json({ 
                    status:"success",
                    message: "Login Successful",
                    data: {
                        user: userInfo.id, 
                        group : userInfo.group_id,
                        email: userInfo.email,
                        phone: userInfo.user_phone,
                        fullname: userInfo.name,
                        username: userInfo.username,
                        'jwt': token
                    }
                })
            
        }
    } catch (error) {
        res.status(200).json({ 
            status:"error",
            message: "error",
            data:  error.message
        })
    }
}


exports.buildingTypes = async(req, res) => {
    let buildingType = await buildingModel.building_types.findAll({raw:true});
    res.status(200).json({
        status: "success",
        message: "success",
        data: buildingType
    })
}
// create building controller 
exports.createBuilding = async(req, res) => {
    try {
        let value= req.body;
        // console.log(value)
        let bulk1 = [];
        const assessmetItem = value.taxitem;
            console.log(assessmetItem)
            if(assessmetItem.length > 0){
                for (const itm of assessmetItem) {
                    let revItem = await assessmentModels.assessment_items.findOne({where: {assessment_item_id: itm}});
                    if(revItem == null){
                        continue;
                      }
                    let data = {
                        ref_no: uuidv4(),
                        assessment_item_id: revItem.assessment_item_id,
                        description: revItem.revenue_name,
                        revenue_code: revItem.revenue_code,
                        item_category: 'building',
                        amount: revItem.tax_amount,
                        taxpayer_rin: value.building_number,
                        tax_year: helper.currentYear,
                        service_id: req.mobileUser.service_id,
                        paid: 0
                    }
                    const item = await assessmentModels.assessment_item_invoices.findOne({where: {assessment_item_id: revItem.assessment_item_id, taxpayer_rin: value.building_number,tax_year: helper.currentYear}})
                    // businessModel.tax_items.findOne({where: { business_tag: value.building_number, taxcode: revItem.id, taxyear: helper.currentYear}})
                    // console.log(item);

                    if(item){
                        // console.log(item, "uupdate")
                      item.update({data}, {new:true})
                    } else {
                        console.log(item, "create")
                      await assessmentModels.assessment_item_invoices.create(data)
                    }
                }
            } 
            const bz = {
                building_number: value.building_number,
                building_name: value.building_name,
                building_image: value.building_image ? await helper.saveBase64imageToFile(value.building_image) : "",
                building_category_id: value.building_category_id,
                state_id: value.state_id,
                lga: value.lga,
                ward: value.ward,
                street_id: value.street_id,
                latitude: value.latitude,
                longitude: value.longitude,
                owner_name: value.owner_name,
                owner_email: value.owner_email,
                owner_mobile_no: value.owner_mobile_no,
                apartment_type: value.apartment_type,
                no_of_apartments: value.no_of_apartments,
                building_id: value.building_id,
                service_id: req.mobileUser.service_id,
                property_id: helper.randomNum(10),
                sync:1
            }
                // const busins =  await createBuildings(value, t);
            const existingBuilding = await buildingModel.buildings.findOne({where: {building_number: bz.building_number,  building_id: bz.building_id}})
            if(existingBuilding){
                existingBuilding.update(bz)
            } else {
                await buildingModel.buildings.create(bz);
            }

            
            res.status(201).json({
                status: 'success',
                message: "Successfully created",
                data: bz.building_number
            })
         
         
        
    } catch (error) {
        console.log(error)
        if(error.parent){
            let myswlError = error.parent;
            res.status(200).json({
                status: 'error',
                message: 'Unknown Error',
                data: myswlError.errno == 1062 ? "Duplicate entry" : myswlError.sqlMessage
            })
        } else {
            res.status(200).json({
                status: 'error',
                message: 'Unknown Error',
                data: error.message,
                stack: error.stack
            })
        }
        
    }
}


exports.createMuiltipleBuilings = async(req, res) => {
    try {
        const arrOfBuildings = req.body.data;
        // console.log(arrOfBuildings)
        let arr = [];
        let bulk1 = [];
        let syncs = [];

        // console.log(arrOfBuildings.length)
        for (const building of arrOfBuildings) {
            let build = {
                building_number: building.building_number,
                building_name: building.building_name,
                building_image: building.building_image ? await helper.saveBase64imageToFile(building.building_image) : "",
                building_category_id: building.building_category_id,
                state_id: building.state_id,
                lga: building.lga,
                ward: building.ward,
                street_id: building.street_id,
                latitude: building.latitude,
                longitude: building.longitude,
                owner_name: building.owner_name,
                owner_email: building.owner_email,
                owner_mobile_no: building.owner_mobile_no,
                apartment_type: building.apartment_type,
                no_of_apartments: building.no_of_apartments,
                building_id: building.building_id,
                service_id: req.mobileUser.service_id,
                property_id: helper.randomNum(10),
                sync:1
            }
            const assessmetItem = building.taxitem;
            // console.log(assessmetItem)
            if(assessmetItem.length > 0){
                for (const itm of assessmetItem) {
                    let revItem = await assessmentModels.assessment_items.findOne({where: {assessment_item_id: itm}});
                    if(revItem == null){
                        continue;
                      }
                    let data = {
                        ref_no: uuidv4(),
                        assessment_item_id: revItem.assessment_item_id,
                        description: revItem.revenue_name,
                        revenue_code: revItem.revenue_code,
                        item_category: 'building',
                        amount: revItem.tax_amount,
                        taxpayer_rin: value.building_number,
                        tax_year: helper.currentYear,
                        service_id: req.mobileUser.service_id,
                        paid: 0
                    }
                    const item = await assessmentModels.assessment_item_invoices.findOne({where: {assessment_item_id: revItem.assessment_item_id, taxpayer_rin: value.building_number,tax_year: helper.currentYear}});
                    if(item){
                      item.update({data}, {new:true})
                    } else {
                      await assessmentModels.assessment_item_invoices.create(data)
                    }
                }
            } 
            // push all the buinding to array
            const existingBuilding = await buildingModel.buildings.findOne({where: {building_number: building.building_number,  building_id: building.building_id}})
            if(existingBuilding){
                existingBuilding.update(build)
                syncs.push(build.building_number)
            } else {
                await buildingModel.buildings.create(build)
                syncs.push(build.building_number)
            }
        }

            // const createdBuildings = await createMuipleB(arr, t);
            // await helper.createTaxItems(bulk1, t)
            // let syncs = createdBuildings.map(syncIds => syncIds.idbuilding )
            // console.log(syncs)
            res.status(201).json({
                status: "success",
                message: "Created Successfully",
                nextpage: parseInt(req.body.page) + 1,
                isEnd: syncs.length > 0 ? 1 : 0,
                syncIds: syncs
                // {processed : createdBuildings.length}
            })
       
       

    } catch (error) {
        console.log(error)
        if(error.parent){
            let myswlError = error.parent;
            res.status(200).json({
                status: 'error',
                message: 'Database Error',
                data: myswlError ? myswlError.errno == 1062 ? "Duplicate entry" : myswlError.sqlMessage : error.message
            })
        } else {
            res.status(200).json({
                status: 'error',
                message: 'Uknown Error',
                data: error.message
            })
        }
        
    }
}

// buisniess api
exports.businessCategories = async(req, res) => {
    let businessCategory = await businessModel.business_categories.findAll({attributes:['business_category_id', 'business_category'], where: {service_id: req.mobileUser.service_id}, raw:true})
    res.status(200).json({
        status: "success",
        message: "success",
        data: businessCategory,
    })
}


exports.businessSector = async(req, res) => {
    let businessSector = await businessModel.business_sectors.findAll({attributes:['business_sector_id', 'business_sector'], where: {service_id: req.mobileUser.service_id}, raw:true})
    res.status(200).json({
        status: "success",
        message: "success",
        data: businessSector,
    })
}

exports.businessOperation = async(req, res) => {
    let businessoperation= await businessModel.business_operations.findAll({attributes:['business_operation_id', 'business_operation'], where: {service_id: req.mobileUser.service_id, business_category : req.params.id}, raw:true})
    res.status(200).json({
        status: "success",
        data: businessoperation,
    })
}


exports.businessSize = async(req, res) => {
    let businessSizes = await businessModel.business_sizes.findAll({attributes:['business_size_id', 'business_size'], where: {organization_id: req.mobileUser.service_id,},  raw:true})
    res.status(200).json({
        status: "success",
        message: "success",
        data: businessSizes,
    })
}

exports.businessTypes = async(req, res) => {
    let businessType = await businessModel.business_types.findAll({raw:true})
    res.status(200).json({
        status: "success",
        message: "success",
        data: businessType,
    })
}

exports.taxItems = async(req, res) => {
    let taxItems = await assessmentModels.assessment_items.findAll({attributes:['assessment_item_id', 'assessment_item_name', ['assessment_group', 'businessSizes']], raw:true})
    res.status(200).json({
        status: "success",
        message: "success",
        data: taxItems,
    })
}

exports.apiBusinesses = async(req, res) => {
    try {
      const arrOfBusiness = req.body.data;
      let arr = [];
      let bulk1 = [];
      let syncs = [];
      let failSyncs = [];
  
      // console.log(arrOfBusiness)
      for (const business of arrOfBusiness) {
        const rin = helper.randomNum(10);
        const tag = helper.randomNum(10);
        let business1 ={
              business_type: business.business_type,
              business_name: business.business_name,
              // business_street_id: business.business_street_id,
              business_category: business.business_category,
              business_sector: business.business_sector,
              business_operation: business.business_operation,
              business_size: business.business_size,
              business_address: business.business_address,
              businessnumber: business.businessnumber,
              business_email: business.business_email,
              business_ownership: business.business_ownership,
              business_tag:tag,
              service_id: req.mobileUser.service_id,
              building_id: business.building_id,
              photo_url: business.photo_url ? await helper.saveBase64imageToFile(business.photo_url) : "",
              taxpayer_rin: rin,
              Status: "ACTIVE",
              asset_type: "Business",
              business_structure: "Business",
              sync:1
          }
  
             const assessmetItem = business.taxitem;
            //   console.log(assessmetItem)
              if(assessmetItem.length > 0){
                  for (const itm of assessmetItem) {
                      let revItem = await assessmentModels.assessment_items.findOne({where: {assessment_item_id: itm}});
                      if(revItem == null){
                        // console.log(revItem, "Skip")
                        continue;
                      }
                      let data = {
                            ref_no: uuidv4(),
                            assessment_item_id: revItem.assessment_item_id,
                            description: revItem.revenue_name,
                            revenue_code: revItem.revenue_code,
                            item_category: 'building',
                            amount: revItem.tax_amount,
                            taxpayer_rin: value.building_number,
                            tax_year: helper.currentYear,
                            service_id: req.mobileUser.service_id,
                            paid: 0
                      }
                      const item = await assessmentModels.assessment_item_invoices.findOne({where: {assessment_item_id: revItem.assessment_item_id, taxpayer_rin: value.building_number,tax_year: helper.currentYear}});
                      if(item){
                        item.update({data}, {new:true})
                      } else {
                        await assessmentModels.assessment_item_invoices.create(data)
                      }
                  }
              } 
  
          // push all the buinding to array
          // arr.push(business1);
          // console.log(arr)
          const busines = await businessModel.businesses.findOne({where: {
            businessnumber: business.businessnumber,
            building_id: business.building_id,
          }});
  
          if(busines){
            busines.update(business1, {new:true})
            syncs.push(business1.business_tag)
          } else {
            await businessModel.businesses.create(business1)
            syncs.push(business1.business_tag)
          }
          
      }
  
        res.status(201).json({
            status: "success",
            message: "Created Successfully",
            page: parseInt(req.body.page) + 1,
            isEnd: syncs.length > 0 ? 1 : 0,
            syncIds: syncs
        })
        
       
    } catch (error) {
      console.log(error)
      if(error.parent){
        let myswlError = error.parent;
        res.status(200).json({
            status: 'error',
            message: 'Database Error',
            data: myswlError ? myswlError.errno == 1062 ? "Duplicate entry" : myswlError.sqlMessage : error.message
        })
      } else {
        res.status(200).json({
          status: 'error',
          message: 'Uknown Error',
          data: error.message
      })
      }
         
    }
  }
  

async function findUser(username, password) {
    console.log(username, password);
    const user = await userModel.Users.findOne({
        where: {
            [Op.or]: [
                { username: username },
                { email: username }
            ]
        }
    })


    // console.log(user)
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user;
        }
        throw Error('incorrect Password')
    }
    throw Error('incorrect username')
}