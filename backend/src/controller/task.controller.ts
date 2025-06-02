import { Request, Response } from "express";

import taskSchema from "../database/schema/task.schema";
import { ITask } from "../database/model/task.model";

export const getTasks = (req: Request, res: Response) => {
    taskSchema
        .find({})
        .then((data: ITask[]) => res.send({ result: 200, data: data }))
        .catch((err: Error) => {
            console.log(err);
            res.send({ result: 500, error: err.message });
        });
};

export const createTask = (req: Request, res: Response) => {
    const data: ITask = req.body;
    console.log(req.body);
    console.log(data);
    new taskSchema(data)
        .save()
        .then((data: ITask) => res.send({ result: 200, data: data }))
        .catch((err: Error) => {
            console.log(err);
            res.send({ result: 500, error: err.message });
        });
};

export const updateTask = (req: Request, res: Response) => {
    console.log(req.body);
    taskSchema
        .findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
        .then((data) => res.send({ result: 200, data: data }))
        .catch((err) => {
            console.log(err);
            res.send({ result: 500, error: err.message });
        });
};

export const deleteTask = (req: Request, res: Response) => {
    taskSchema
        .findByIdAndDelete(req.params.id)
        .then((data) => res.send({ result: 200, data: data }))
        .catch((err) => {
            console.log(err);
            res.send({ result: 500, error: err.message });
        });
};
