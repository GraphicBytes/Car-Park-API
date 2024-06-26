//##########################################################
//############### HANDLE UPDATE THEME COLORS ###############
//##########################################################

////////////////////////////
////// CONFIG IMPORTS //////
////////////////////////////
import { sysMsg } from '../config/systemMessages.js';

////////////////////////////////
////// DATA MODEL IMPORTS //////
//////////////////////////////// 
import { platformsModel } from '../models/platformsModel.js';

//////////////////////////////
////// FUNCTION IMPORTS //////
////////////////////////////// 
import { openAdminToken } from '../functions/openAdminToken.js';
import { logMalicious } from '../functions/malicious/logMalicious.js';
import { getPlatformData } from '../functions/getPlatformData.js';
import { resSendNotFound } from '../functions/resSend/resSendNotFound.js';
import { resSendOk } from '../functions/resSend/resSendOk.js';
import { isNullOrEmpty } from '../functions/helpers/isNullOrEmpty.js';


//////////////////////////
////// THIS HANDLER //////
//////////////////////////

export async function handleUpdateThemeColors(app, req, res) {

  let outputResult = {
    "qry": 0,
    "newData": {},
  };
  let msg = {}

  try {

    //#########################
    //##### CHECK REQUEST #####
    //#########################

    //////////////////////
    ////// CHECK PLATFORM //////
    //////////////////////
    let platform = req.params.fromPlatform;
    let platformData = await getPlatformData(platform);
    if (!platformData) {

      msg[1] = sysMsg[1];

      logMalicious(req, "1");
      resSendOk(req, res, outputResult, msg);
      return null;
    }

    //////////////////////
    ////// CHECK ADMIN TOKEN //////
    //////////////////////
    if (
      isNullOrEmpty(req.body.admin_token)
    ) {

      msg[2] = sysMsg[2];

      logMalicious(req, "2");
      resSendOk(req, res, outputResult, msg);
      return null;
    }

    //////////////////////
    ////// CHECK NEW DATA SUBMITTED //////
    //////////////////////
    if (
      isNullOrEmpty(req.body.new_data)
    ) {

      msg[3] = sysMsg[3];

      logMalicious(req, "3");
      resSendOk(req, res, outputResult, msg);
      return null;
    }

    //////////////////////
    ////// OPEN ADMIN TOKEN //////
    //////////////////////
    const adminTokenData = await openAdminToken(req, req.body.admin_token, platform);
    if (!adminTokenData.valid) {

      msg[adminTokenData.msgCode] = sysMsg[adminTokenData.msgCode];

      logMalicious(req, adminTokenData.msgCode);
      resSendOk(req, res, outputResult, msg);
      return null;
    }

    //////////////////////
    ////// IS THE USER A SUPER USER FOR THIS PLATFORM //////
    //////////////////////
    if (adminTokenData.data.super_user !== 1) {

      msg[9] = sysMsg[9];

      logMalicious(req, "9");
      resSendOk(req, res, outputResult, msg);
      return null;

    }

    //////////////////////
    ////// DO UPDATE //////
    //////////////////////
    const newData = JSON.parse(req.body.new_data);

    let filter = { platform: platform };
    let update = {
      $set: {
        'data.theme_data.theme_colors': newData,
      }
    };
    let opts = { upsert: true };
    await platformsModel.collection.updateOne(filter, update, opts);

    outputResult.qry = 1;
    outputResult.newData = newData

    resSendOk(req, res, outputResult);

    return null;

  } catch (error) {

    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }

    msg[0] = sysMsg[0];
    resSendNotFound(req, res, outputResult, msg);

    return null;
  }
}
export default handleUpdateThemeColors;