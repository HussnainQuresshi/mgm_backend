//routes.ts file express.js

import { Router } from 'express';
import { getJsonFile, jsonFileAction } from './Services/demo.service.js';

const Routes = Router();

Routes.get('/get-json-file', getJsonFile);
Routes.post('/json-file-action', jsonFileAction);

export default Routes;
