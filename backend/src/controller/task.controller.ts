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
    .populate("userId", "-password")
    .populate("createdBy", "-password")
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
  const data: ITask = {
    ...req.body,
    userId: assignedUserId,
    createdBy: user.id,
  };
  new taskSchema(data)
    .save()
    .then((newTask) =>
      taskSchema
        .findById(newTask._id)
        .populate("userId", "-password")
        .populate("createdBy", "-password")
    )
    .then((populatedTask) => {
      res.send({ result: 200, data: populatedTask });
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

// Add a comment to a task
export const addTaskComment: RequestHandler = async (req, res) => {
  // @ts-expect-error req.user is set by authentication middleware
  const user = req.user;
  const { comment } = req.body;
  if (!comment || typeof comment !== "string" || !comment.trim()) {
    res.status(400).json({ result: 400, error: "Comment is required" });
    return;
  }
  try {
    const task = await taskSchema.findById(req.params.id);
    if (!task) {
      res.status(404).json({ result: 404, error: "Task not found" });
      return;
    }
    const newComment = {
      userId: user.id,
      comment,
      createdAt: new Date(),
    };
    task.comments = task.comments || [];
    task.comments.push(newComment);
    await task.save();
    // Optionally populate userId in comments for frontend display
    const updatedTask = await taskSchema
      .findById(task._id)
      .populate("userId", "-password")
      .populate("createdBy", "-password")
      .populate("comments.userId", "-password");
    res.send({ result: 200, data: updatedTask });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      result: 500,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

// Get a single task by id
export const getTaskById: RequestHandler = async (req, res) => {
  try {
    const task = await taskSchema
      .findById(req.params.id)
      .populate("userId", "-password")
      .populate("createdBy", "-password")
      .populate("comments.userId", "-password");
    if (!task) {
      res.status(404).json({ result: 404, error: "Task not found" });
      return;
    }
    res.send({ result: 200, data: task });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({
        result: 500,
        error: err instanceof Error ? err.message : String(err),
      });
  }
};
