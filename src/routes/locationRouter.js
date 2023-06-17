const express = require('express');
const getCountryLocation = require('../controllers/locationController');
const { getCountry, getState, getLga, getWards, createWard, editWard, deleteWard, getStreet, createNewStreet } = require('../dataPersistence/locationSettingPersistence');
const { validateWards, validateStreet } = require('../config/validation');
const Router = express.Router();

Router.route('/country')
.get(async(req, res) => {
    const countries = await getCountry();
    const data = await getCountryLocation.getCountryLocation(countries);
    res.status(200).render('./settings/location/country', {
        data
    })
})
.post()

Router.route('/state')
.get(async(req, res) => {
    const stateData = await getState();
    const data = await getCountryLocation.getStateLocations(stateData)
    res.status(200).render('./settings/location/state', {
        ...data
    })
})
.post()

Router.route('/lga')
.get(async(req, res) => {
    const lgaData = await getLga();
    const rtd = await getCountryLocation.getLGALocations(lgaData)
    res.status(200).render('./settings/location/lga', {
        ...rtd
    })
})
.post()

Router.route('/ward')
.get(async(req, res) => {
    const lgaData = await getWards();
    const rtd = await getCountryLocation.getWardLocations(lgaData)
    res.status(200).render('./settings/location/ward', {
        ...rtd
    })
})
.post(async(req, res) => {
    try {
        // console.log(req.body)
        await getCountryLocation.storeWards({validateWards, createWard}, req.body, req.user);
        res.status(201).json({
            status: "success",
            message: "Ward created!"
        })
    } catch (error) {
        res.status(200).json({
            status: "error",
            message: error.message
        })
    }
})
.put(async(req, res) => {
    try {
        // console.log(req.body)
        await getCountryLocation.updateWard({validateWards, editWard}, req.body);
        res.status(201).json({
            status: "success",
            message: "Updated created!"
        })
    } catch (error) {
        res.status(200).json({
            status: "error",
            message: error.message
        })
    }
})
.delete(async(req, res) => {
    try {
        console.log(req.body)
        await deleteWard(req.body.id);
        res.status(200).json({
            status: "success",
            message: "Updated created!"
        })
    } catch (error) {
        res.status(200).json({
            status: "error",
            message: error.message
        })
    }
});

Router.route('/street')
.get(async(req, res) => {
    try {
       const newData = await getStreet()
       const rtd = await getCountryLocation.getStreets(newData) 
       res.status(200).render('./settings/location/streets', {
        ...rtd
    })
    } catch (error) {
        console.log(error)
    }
})
.post(async(req, res) => {
    try {
        console.log(req.body)
        await getCountryLocation.storeStreet({validateStreet, createNewStreet}, req.body, req.user);
        res.status(201).json({
            status: "success",
            message: "Ward created!"
        })
    } catch (error) {
        console.log(error)
        res.status(200).json({
            status: "error",
            message: error.message
        })
    }
})


module.exports = Router;

