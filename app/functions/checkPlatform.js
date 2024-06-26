//#######################################################
//############### PLATFORM CHECK FUNCTION ###############
//#######################################################

////////////////////////////
////// CONFIG IMPORTS //////
////////////////////////////
import options from '../../config/options.js'; 

////////////////////////////////
////// DATA MODEL IMPORTS //////
////////////////////////////////
import { platformsModel } from '../models/platformsModel.js';

///////////////////////////
////// THIS FUNCTION //////
///////////////////////////
async function checkPlatform(platform) { 
  return new Promise((resolve) => {  

      platformsModel.findOne({ platform: platform }, function (err, obj) {

        if (process.env.NODE_ENV === "development" && options.devConsoleOutput === 1) {
          console.log("---DB: looked up platform existance");
        }

        if (obj) { 
          resolve(true);
        } else { 
          resolve(false);
        }
      }); 

  });
}

module.exports = checkPlatform;