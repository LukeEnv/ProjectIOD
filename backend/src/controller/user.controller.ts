// In this file we will contain all the logic relating to handling user requests and responses,
// including logic for contacting the service layer to perform database operations for us.

import { Request, Response } from "express";
let userModel = require("../database/schema/user.schema");

// export default function userController() {
//     // Controller logic goes here
// }

const getUsers = (res: Response) => {
    userModel
        .find({})
        .then((data: String) => res.send({ result: 200, data: data }))
        .catch((err: Error) => {
            console.log(err);
            res.send({ result: 500, error: err.message });
        });
};
const createUser = (data: String, res: Response) => {
    console.log(data);
    new userModel(data)
        .save()
        .then((data: String) => res.send({ result: 200, data: data }))
        .catch((err: Error) => {
            console.log(err);
            res.send({ result: 500, error: err.message });
        });
};

export default module.exports = {
    getUsers,
    createUser,
};
