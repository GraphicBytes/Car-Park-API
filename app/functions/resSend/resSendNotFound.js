//########################################################
//############### Send Output 404 Function ###############
//########################################################
/// Function tries to include any manual thing like http headers for cors policies etc for files.

////////////////////////////////
////// DATA MODEL IMPORTS //////
//////////////////////////////// 
import { apiDataModel } from '../../models/apiDataModel.js';

/////////////////////////////////////
////// NODE & NPM DEPENDENCIES //////
/////////////////////////////////////
import { URL } from 'url';

///////////////////////////
////// THIS FUNCTION //////
///////////////////////////
export async function resSendNotFound(req, res, send, msg={}) {

  try {

    let allowedOrigins = [];
    const apiData = await apiDataModel.findOne({ meta_key: "allowed_origins" });
    if (!apiData) {
      console.error("allowedOrigins missing from api_data DB table");
    } else {

      if (apiData.meta_value !== undefined) {
        if (apiData.meta_value[0] !== undefined) {
          allowedOrigins = apiData.meta_value[0];
        }
      }
    }

    const origin = req.get('Referrer');
    if (origin) {

      let parsedUrl = new URL(origin);
      let domain = parsedUrl.origin;

      if (allowedOrigins.includes(domain)) {
        res.setHeader('Access-Control-Allow-Origin', domain);
      } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
      }
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Expires', '-1');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Strict-Transport-Security', 'max-age=0; includeSubDomains');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'no-referrer');

    res.statusCode = 200;
    send.msg = msg;

    if (process.env.NODE_ENV === "development") {

      send["__development"] = {};
  
      if (send.status !== undefined) {
        send["__development"].status = "deprecated"
      }
  
      if (send.qry !== undefined) {
        send["__development"].qry = "[always] query accepted 1(yes):0(no) ";
      }
  
      if (send.msg !== undefined) {
        send["__development"].msg = "[always] object containing server messages";
      }
      
      send["__development"]["*"] = "[vary] requested data for front-end use";
  
      send["__development"].request = {}
      if (req.body !== undefined) {
        send["__development"].request.formData = req.body;
      }    
      if (req.params !== undefined) {
        send["__development"].request.urlPrams = req.params;
      }
      if (req.params !== undefined) {
        send["__development"].request.cookies = req.cookies;
      }
      
    }

    res.send(send);

    return null;

  } catch (error) {

    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }

    res.send({});
    return null;

  }
}
