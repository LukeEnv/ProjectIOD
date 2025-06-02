// export default function customerController() {}

import { Request, Response } from "express";

import customerSchema from "../database/schema/customer.schema";
import { ICustomer } from "../database/model/customer.model";

export const getCustomers = (req: Request, res: Response) => {
    customerSchema
        .find({})
        .then((data: ICustomer[]) => res.send({ result: 200, data: data }))
        .catch((err: Error) => {
            console.log(err);
            res.send({ result: 500, error: err.message });
        });
};

export const createCustomer = (req: Request, res: Response) => {
    const data: ICustomer = req.body;
    console.log(req.body);
    console.log(data);
    new customerSchema(data)
        .save()
        .then((data: ICustomer) => res.send({ result: 200, data: data }))
        .catch((err: Error) => {
            console.log(err);
            res.send({ result: 500, error: err.message });
        });
};

export const updateCustomer = (req: Request, res: Response) => {
    console.log(req.body);
    customerSchema
        .findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
        .then((data) => res.send({ result: 200, data: data }))
        .catch((err) => {
            console.log(err);
            res.send({ result: 500, error: err.message });
        });
};

export const deleteCustomer = (req: Request, res: Response) => {
    customerSchema
        .findByIdAndDelete(req.params.id)
        .then((data) => res.send({ result: 200, data: data }))
        .catch((err) => {
            console.log(err);
            res.send({ result: 500, error: err.message });
        });
};
