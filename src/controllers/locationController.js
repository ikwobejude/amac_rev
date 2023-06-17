module.exports = {
  getCountryLocation: async (data) => {
    return data;
  },
  // state controller functions
  getStateLocations: async (data) => {
    return data;
  },

  // LGA controller functions
  getLGALocations: async (data) => {
    return data;
  },

  // Ward controller functions
  getWardLocations: async (data) => {
    return data;
  },

  // create wards
  storeWards: async({validateWards, createWard}, formData, metaData) => {
   try {
    const {value, error} = validateWards.validate(formData);
    if(error){
        throw Error(error.message.split("'").join(""));
    } else {
        const newData = createWard(value, metaData);
        return newData
    }
   } catch (error) {
    throw Error(error.message);
   }
  },

  updateWard: async({validateWards, editWard}, formData) => {
    try {
     const {value, error} = validateWards.validate(formData);
     if(error){
         throw Error(error.message.split("'").join(""));
     } else {
         const newData = editWard(value);
         return newData
     }
    } catch (error) {
     throw Error(error.message);
    }
   },

   // streets 
   getStreets: async(data) => {
    return data;
   },

     // create wards
  storeStreet: async({validateStreet, createNewStreet}, formData, metaData) => {
    try {
     const {value, error} = validateStreet.validate(formData);
     if(error){
         throw Error(error.message.split("'").join(""));
     } else {
         const newData = createNewStreet(value, metaData);
         return newData
     }
    } catch (error) {
     throw Error(error.message);
    }
   },
};
