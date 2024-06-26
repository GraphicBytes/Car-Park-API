//#################################################
//############### Get Platform Data ###############
//#################################################

////////////////////////////
////// CONFIG IMPORTS //////
////////////////////////////
import { sysMsg } from '../config/systemMessages.js';

//////////////////////////////
////// FUNCTION IMPORTS //////
//////////////////////////////
import { resSendOk } from '../functions/resSend/resSendOk.js';
import { resSendNotFound } from '../functions/resSend/resSendNotFound.js';
import { logMalicious } from '../functions/malicious/logMalicious.js';
import { getPlatformData } from '../functions/getPlatformData.js';

//////////////////////////
////// THIS HANDLER //////
//////////////////////////
export async function handleGetData(app, req, res) {

  let outputResult = {
    "status": 0,
    "qry": 0
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

    outputResult['status'] = 1;
    outputResult['qry'] = 1;
    outputResult['msg'] = msg;
    outputResult['data'] = platformData;

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
export default handleGetData;