import express from "express";
import dotenv from "dotenv";

import appSetup from "./common/init";
import routerSetup from "./common/router";

dotenv.config();
const app = express();

appSetup(app);
routerSetup(app);
