//####################################################
//####################################################
//#############                          #############
//#############       CAR PARK API       #############
//#############                          #############
//####################################################
//####################################################

//################################################
//############### CORE API MODULES ###############
//################################################ 
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

//##################################################
//############### CREATE EXPRESS APP ###############
//##################################################
const app = express();

//###########################################
//############### APP OPTIONS ###############
//###########################################
app.disable('x-powered-by'); 
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => { callback(null, origin) },
  credentials: true
}));
app.use(express.json({ limit: '50000mb' }));
app.use((req, res, next) => {
  app.locals.session_id = null;
  next();
});  

//###################################################
//############# REQUEST HANDLER IMPORTS #############
//###################################################
import handleGetDefault from './handlers/handleGetDefault.js';
import handleTest from './handlers/handleTest.js';
import handleGetData from './handlers/handleGetData.js';
import handleUpdateThemeColors from './handlers/handleUpdateThemeColors.js';
import handleUpdateThemeFonts from './handlers/handleUpdateThemeFonts.js';
import handleUpdateThemeLogo from './handlers/handleUpdateThemeLogo.js';
import handleUpdateThemeFavIcon from './handlers/handleUpdateThemeFavIcon.js';

 
//##############################################
//############### REQUEST ROUTER ###############
//##############################################

///////////////////////////////
////// SYSTEM END POINTS //////
///////////////////////////////

////// TEST FILE //////
app.get('/test/', (req, res) => {
  handleTest(app, req, res);
});

////////////////////////
////// END POINTS //////
////////////////////////
 
// get platform theme and api data

// trailing "/" deprecated, daz, 12.06.24
app.get('/get-data/:fromPlatform/', (req, res) => {
  handleGetData(app, req, res); 
});

app.get('/get-data/:fromPlatform', (req, res) => {
  handleGetData(app, req, res); 
});

// update theme colors
app.post('/update-theme-colors/:fromPlatform', (req, res) => {
  handleUpdateThemeColors(app, req, res); 
});

// update theme fonts
app.post('/update-theme-fonts/:fromPlatform', (req, res) => {
  handleUpdateThemeFonts(app, req, res); 
});

// update theme logo
app.post('/update-theme-logo/:fromPlatform', (req, res) => {
  handleUpdateThemeLogo(app, req, res); 
});

// update theme Fav Icon
app.post('/update-theme-fav-icon/:fromPlatform', (req, res) => {
  handleUpdateThemeFavIcon(app, req, res); 
});

/////////////////
////// END //////
/////////////////


////// 404 //////
app.use((req, res) => {
  handleGetDefault(app, req, res);
});

export default app; 
