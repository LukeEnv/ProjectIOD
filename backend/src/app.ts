import express from "express";
const app = express();

import appSetup from "./common/init";
import routerSetup from "./common/router";

appSetup(app);
routerSetup(app);
