// This file is responsible for setting up the Express application and initialising the router.

import express from "express";
import dotenv from "dotenv";

import appSetup from "./common/init"; // I have split the app setup into a separate file for better organisation.
import routerSetup from "./common/router"; // I have split the router setup into a separate file for better organisation.

dotenv.config();
const app = express();

appSetup(app);
routerSetup(app);
