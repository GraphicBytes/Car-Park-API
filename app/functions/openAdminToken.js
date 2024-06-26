//################################################
//############### OPEN ADMIN TOKEN ###############
//################################################

//////////////////////////////
////// FUNCTION IMPORTS //////
//////////////////////////////
import { decrypt } from './crypt/decrypt.js';
import { theEpochTime } from './helpers/theEpochTime.js';
import { theUserAgent } from './helpers/theUserAgent.js';
import { theUserIP } from './helpers/theUserIP.js';

///////////////////////////
////// THIS FUNCTION //////
//////////////////////////
export async function openAdminToken(req, token, platform) {

  const toReturn = {
    valid: false,
    msgCode: 0,
    data:{}
  }

  try {
    //////////////////////
    ////// DECRYPT ADMIN TOKEN //////
    //////////////////////
    const adminTokenData = JSON.parse(decrypt(token, process.env.NETWORK_PRIMARY_ENCRYPTION_KEY));
    if (!adminTokenData) {
      return toReturn;
    }

    //////////////////////
    ////// CHECK IP //////
    //////////////////////
    const userIP = theUserIP(req);
    const tokenIP = adminTokenData.user_ip;
    if (userIP !== tokenIP) {
      toReturn.msgCode = 5
      return toReturn;
    }

    //////////////////////
    ////// CHECK USER AGENT //////
    //////////////////////
    const userAgent = theUserAgent(req);
    const tokenUserAgent = adminTokenData.user_agent;
    if (userAgent !== tokenUserAgent) {
      toReturn.msgCode = 6
      return toReturn;
    }

    //////////////////////
    ////// CHECK TOKEN PLATFORM //////
    //////////////////////
    if (platform !== adminTokenData.platform) {
      toReturn.msgCode = 7
      return toReturn;
    }

    //////////////////////
    ////// CHECK TOKEN AGE //////
    //////////////////////
    const requestTime = theEpochTime();
    if (requestTime > adminTokenData.kill_at) {
      toReturn.msgCode = 8
      return toReturn;
    }     
    
    //////////////////////
    ////// RETURN DATA //////
    //////////////////////
    toReturn.valid = true;
    toReturn.data = adminTokenData;
    return toReturn;

  } catch (error) {

    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }

    return false;
  }
}
export default openAdminToken;