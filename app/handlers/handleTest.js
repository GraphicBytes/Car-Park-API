//###########################################
//############### HANDLE TEST ###############
//###########################################

//////////////////////////////
////// FUNCTION IMPORTS //////
//////////////////////////////
import { resSendOk } from '../functions/resSend/resSendOk.js';

//////////////////////////
////// THIS HANDLER //////
//////////////////////////
export async function handleTest(app, req, res) {

  let outputResult = {
    "status": 0,
    "qry": 0
  };
  let msg = {}

  try {

    resSendOk(req, res, outputResult);

    return null;

  } catch (error) {

    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }

    resSendOk(req, res, outputResult, msg);

    return null;
  }
}

export default handleTest;