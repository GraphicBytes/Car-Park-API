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
import { triggerFileProcessing } from '../functions/loading-dock/triggerFileProcessing.js';

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
    const platform = req.params.fromPlatform;
    const platformData = await getPlatformData(platform);
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
    ////// CHECK NEW FILE ID SUBMITTED //////
    //////////////////////
    if (
      isNullOrEmpty(req.body.new_file_id)
    ) {

      msg[3] = sysMsg[3];

      logMalicious(req, "3");
      resSendOk(req, res, outputResult, msg);
      return null;
    }

    //////////////////////
    ////// CHECK THEME TYPE SUBMITTED //////
    //////////////////////
    if (
      isNullOrEmpty(req.body.mode_for)
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
    const newFileID = req.body.new_file_id;
    const modeFor = req.body.mode_for;
    const defaultGroupId = platformData.default_user_group;

    const processingTriggered = await triggerFileProcessing(platform, newFileID, defaultGroupId, 'system_logo');

    if (processingTriggered) {

      const newUrl = `https://${process.env.DEFAULT_WAREHOUSE_URL}/image/${platform}/${newFileID}.webp`;


      if (modeFor === "light") {
        await platformsModel.collection.updateOne(
          { platform: platform },
          {
            $set: {
              'data.theme_data.theme_logo.lightLogo': newUrl,
            }
          },
          { upsert: true }
        );
      } else {
        await platformsModel.collection.updateOne(
          { platform: platform },
          {
            $set: {
              'data.theme_data.theme_logo.darkLogo': newUrl,
            }
          },
          { upsert: true }
        );
      }

      outputResult.qry = 1;
      outputResult.newLogoUrl = newUrl;

      resSendOk(req, res, outputResult);

      return null;

    } else {
      msg[10] = sysMsg[10];
      resSendOk(req, res, outputResult, msg);
      return null;
    }

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