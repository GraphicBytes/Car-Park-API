//##########################################################
//############### GET PLATFORM DATA FUNCTION ###############
//##########################################################

////////////////////////////
////// CONFIG IMPORTS //////
////////////////////////////
import options from '../config/options.js'; 

////////////////////////////////
////// DATA MODEL IMPORTS //////
////////////////////////////////
import { platformsModel } from '../models/platformsModel.js'; 

///////////////////////////
////// THIS FUNCTION //////
///////////////////////////
export async function getPlatformData(platform) { 
  
  return new Promise((resolve) => { 

      platformsModel.findOne({
        $or: [
          { platform: platform },
          { local_key: platform },
          { vps_key: platform },
          { development_key: platform },
          { staging_key: platform },
          { domain_key: platform }
        ]
      }, function (err, obj) {

        if (process.env.NODE_ENV === "development" && options.devConsoleOutput === 1) {
          console.log("---DB: looked for platform data");
        }

        if (obj) { 
          resolve(obj.data);

        } else { 
          resolve(false);
        }
      }); 
  });
}
