import { RequestHandler } from "express";
import taskSchema from "../database/schema/task.schema";
import { ITask } from "../database/model/task.model";

// Assumes req.user is set by authentication middleware and contains { id, isAdmin }

export const getTasks: RequestHandler = (req, res) => {
  // @ts-expect-error req.user is set by authentication middleware
  const user = req.user;
  let query = {};
  if (!user?.isAdmin) {
    query = { userId: user.id };
  }
  taskSchema
    .find(query)
    .then((tasks) => {
      res.send({ result: 200, data: tasks });
    })
    .catch((err) => {
      console.log(err);
      res.send({
        result: 500,
        error: err instanceof Error ? err.message : String(err),
      });
    });
};

export const createTask: RequestHandler = (req, res) => {
  // @ts-expect-error req.user is set by authentication middleware
  const user = req.user;
  let assignedUserId = user.id;
  if (user.isAdmin && req.body.userId) {
    // Admin can assign to any user
    assignedUserId = req.body.userId;
  }
  const data: ITask = { ...req.body, userId: assignedUserId };
  new taskSchema(data)
    .save()
    .then((newTask) => {
      res.send({ result: 200, data: newTask });
    })
    .catch((err) => {
      console.log(err);
      res.send({
        result: 500,
        error: err instanceof Error ? err.message : String(err),
      });
    });
};

export const updateTask: RequestHandler = (req, res) => {
  // @ts-expect-error req.user is set by authentication middleware
  const user = req.user;
  let updates = req.body;
  if (user.isAdmin && req.body.userId) {
    // Admin can reassign
    updates = { ...updates, userId: req.body.userId };
  } else {
    // Non-admins cannot change assignment
    delete updates.userId;
  }
  taskSchema
    .findByIdAndUpdate(req.params.id, updates, { new: true })
    .then((updatedTask) => {
      res.send({ result: 200, data: updatedTask });
    })
    .catch((err) => {
      console.log(err);
      res.send({
        result: 500,
        error: err instanceof Error ? err.message : String(err),
      });
    });
};

export const deleteTask: RequestHandler = (req, res) => {
  taskSchema
    .findByIdAndDelete(req.params.id)
    .then((data) => {
      res.send({ result: 200, data: data });
    })
    .catch((err) => {
      console.log(err);
      res.send({
        result: 500,
        error: err instanceof Error ? err.message : String(err),
      });
    });
};
