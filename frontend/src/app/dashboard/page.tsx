"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableCaption,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useTasksContext } from "@/lib/contexts/tasks";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserContext, useAllUsers } from "@/lib/contexts/user";
import { useAllCustomers } from "@/lib/contexts/customer";
import { Task } from "@/types/task";
import { Customer } from "@/types/customer";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Remove unused PopulatedUser type

export default function Dashboard() {
  const {
    tasks,
    isLoading,
    isError,
    createTask,
    updateTask,
    addTaskComment,
    deleteTask,
  } = useTasksContext();
  const { user, createCustomer } = useUserContext();
  const { data: allUsers } = useAllUsers();
  const { data: allCustomers } = useAllCustomers();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Task>>({});
  const [submitting, setSubmitting] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState<Partial<Customer>>({});
  const [customerSubmitting, setCustomerSubmitting] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Task>>({});
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  type TasksApiResponse = { data: Task[] };
  const taskArray: Task[] = Array.isArray(tasks)
    ? tasks
    : tasks && Array.isArray((tasks as TasksApiResponse).data)
    ? (tasks as TasksApiResponse).data
    : [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTask(form);
      setOpen(false);
      setForm({});
    } finally {
      setSubmitting(false);
    }
  };

  const handleCustomerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCustomerForm({ ...customerForm, [e.target.name]: e.target.value });
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerSubmitting(true);
    try {
      await createCustomer(customerForm);
      setCustomerOpen(false);
      setCustomerForm({});
    } finally {
      setCustomerSubmitting(false);
    }
  };

  // Helper to get customer name by id
  const getCustomerName = (id: string) => {
    if (!allCustomers) return "Loading...";
    const customer = allCustomers.find((c) => c._id === id);
    return customer ? `${customer.firstName} ${customer.lastName}` : "Unknown";
  };

  // Helper to render user info
  const renderUser = (user: unknown) => {
    if (
      user &&
      typeof user === "object" &&
      user !== null &&
      "firstName" in user &&
      "lastName" in user &&
      "username" in user
    ) {
      const u = user as {
        firstName: string;
        lastName: string;
        username: string;
      };
      return `${u.firstName} ${u.lastName} (${u.username})`;
    }
    return String(user);
  };

  // When opening a task, reset edit mode and form
  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
    setEditMode(false);
    setEditForm(task);
  };

  // Add comment to task
  const handleAddComment = async () => {
    if (!selectedTask || !commentText.trim()) return;
    setCommentSubmitting(true);
    try {
      await addTaskComment(selectedTask._id, commentText);
      setCommentText("");
      // Refetch the updated task from backend and update selectedTask
      const res = await fetch(`/api/tasks/${selectedTask._id}`);
      if (res.ok) {
        const data = await res.json();
        // Support both { result, data } and direct data
        setSelectedTask(data.data || data);
      }
    } finally {
      setCommentSubmitting(false);
    }
  };

  // Delete task handler
  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    setDeleteSubmitting(true);
    try {
      await deleteTask(selectedTask._id);
      setSelectedTask(null);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-screen-2xl mx-auto my-auto">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="font-semibold">Tasks</p>
      {user?.isAdmin && (
        <Button className="w-fit mb-2" onClick={() => setOpen(true)}>
          Create Task
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Input
              name="title"
              placeholder="Title"
              value={form.title || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="requirements"
              placeholder="Requirements"
              value={form.requirements || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="notes"
              placeholder="Notes"
              value={form.notes || ""}
              onChange={handleChange}
              required
            />
            <Select
              value={form.customerId || ""}
              onValueChange={(val) => setForm({ ...form, customerId: val })}
              disabled={!allCustomers || allCustomers.length === 0}
              name="customerId"
              required
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !allCustomers
                      ? "Loading customers..."
                      : allCustomers.length === 0
                      ? "No customers available"
                      : "Select customer"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {!allCustomers && (
                  <SelectItem value="loading" disabled>
                    Loading customers...
                  </SelectItem>
                )}
                {allCustomers && allCustomers.length === 0 && (
                  <SelectItem value="none" disabled>
                    No customers available
                  </SelectItem>
                )}
                {allCustomers &&
                  allCustomers.length > 0 &&
                  allCustomers.map((c) => (
                    <SelectItem key={c._id} value={c._id!}>
                      {c.firstName} {c.lastName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Input
              name="dueDate"
              type="date"
              value={form.dueDate ? form.dueDate.slice(0, 10) : ""}
              onChange={handleChange}
              required
            />
            {/* Status Select for Create Task */}
            <Select
              value={form.status || ""}
              onValueChange={(val) => setForm({ ...form, status: val })}
              name="status"
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={form.userId || ""}
              onValueChange={(val) => setForm({ ...form, userId: val })}
              name="userId"
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Assign to user" />
              </SelectTrigger>
              <SelectContent>
                {allUsers &&
                  (
                    allUsers as {
                      _id: string;
                      firstName: string;
                      lastName: string;
                      username: string;
                    }[]
                  ).map((u) => (
                    <SelectItem key={u._id} value={u._id}>
                      {u.firstName} {u.lastName} ({u.username})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Button className="w-fit mb-2" onClick={() => setCustomerOpen(true)}>
        Create Customer
      </Button>
      <Dialog open={customerOpen} onOpenChange={setCustomerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Customer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCustomerSubmit} className="flex flex-col gap-2">
            <Input
              name="firstName"
              placeholder="First Name"
              value={customerForm.firstName || ""}
              onChange={handleCustomerChange}
              required
            />
            <Input
              name="lastName"
              placeholder="Last Name"
              value={customerForm.lastName || ""}
              onChange={handleCustomerChange}
              required
            />
            <Input
              name="email"
              placeholder="Email"
              value={customerForm.email || ""}
              onChange={handleCustomerChange}
              required
            />
            <Input
              name="phone"
              placeholder="Phone"
              type="number"
              value={customerForm.phone || ""}
              onChange={handleCustomerChange}
              required
            />
            <Input
              name="address"
              placeholder="Address"
              value={customerForm.address || ""}
              onChange={handleCustomerChange}
              required
            />
            <DialogFooter>
              <Button type="submit" disabled={customerSubmitting}>
                {customerSubmitting ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Card className="p-0">
        <Table>
          <TableCaption>A list of your recent tasks.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Title</TableHead>
              <TableHead>Requirements</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Created By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={8}>Loading...</TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={8}>Failed to load tasks.</TableCell>
              </TableRow>
            )}
            {taskArray && taskArray.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={8}>No tasks found.</TableCell>
              </TableRow>
            )}
            {taskArray &&
              taskArray.map((task) => (
                <TableRow
                  key={task._id}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleOpenTask(task)}
                >
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{task.requirements}</TableCell>
                  <TableCell>{task.notes}</TableCell>
                  <TableCell>{getCustomerName(task.customerId)}</TableCell>
                  <TableCell>
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{renderUser(task.userId)}</TableCell>
                  <TableCell>{renderUser(task.createdBy)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
      {/* Task Details Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          {selectedTask && !editMode && (
            <div className="flex flex-col gap-2">
              <div>
                <strong>Title:</strong> {selectedTask.title}
              </div>
              <div>
                <strong>Requirements:</strong> {selectedTask.requirements}
              </div>
              <div>
                <strong>Notes:</strong> {selectedTask.notes}
              </div>
              <div>
                <strong>Customer:</strong>{" "}
                {getCustomerName(selectedTask.customerId)}
              </div>
              <div>
                <strong>Due Date:</strong>{" "}
                {selectedTask.dueDate
                  ? new Date(selectedTask.dueDate).toLocaleDateString()
                  : ""}
              </div>
              <div>
                <strong>Status:</strong> {selectedTask.status}
              </div>
              <div>
                <strong>Assigned To:</strong> {renderUser(selectedTask.userId)}
              </div>
              <div>
                <strong>Created By:</strong>{" "}
                {renderUser(selectedTask.createdBy)}
              </div>
              <div>
                <strong>Created At:</strong>{" "}
                {selectedTask.createdAt
                  ? new Date(selectedTask.createdAt).toLocaleString()
                  : ""}
              </div>
              <div>
                <strong>Updated At:</strong>{" "}
                {selectedTask.updatedAt
                  ? new Date(selectedTask.updatedAt).toLocaleDateString()
                  : ""}
              </div>
              {/* Comments Section */}
              <div className="mt-4">
                <strong>Comments:</strong>
                <div className="flex flex-col gap-2 mt-2 max-h-40 overflow-y-auto border rounded p-2 bg-muted/50">
                  {selectedTask.comments && selectedTask.comments.length > 0 ? (
                    selectedTask.comments.map((c, idx) => (
                      <div
                        key={c._id || idx}
                        className="text-sm border-b last:border-b-0 pb-1"
                      >
                        <span className="font-semibold">
                          {renderUser(c.userId)}
                        </span>
                        : {c.comment}
                        <span className="ml-2 text-xs text-muted-foreground">
                          {new Date(c.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No comments yet.
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    disabled={commentSubmitting}
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={commentSubmitting || !commentText.trim()}
                  >
                    {commentSubmitting ? "Adding..." : "Add"}
                  </Button>
                </div>
              </div>
            </div>
          )}
          {selectedTask && editMode && (
            <form
              className="flex flex-col gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                setEditSubmitting(true);
                try {
                  await updateTask(selectedTask._id, editForm);
                  setEditMode(false);
                  setSelectedTask({ ...selectedTask, ...editForm });
                } finally {
                  setEditSubmitting(false);
                }
              }}
            >
              <Input
                name="title"
                placeholder="Title"
                value={editForm.title || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                required
              />
              <Input
                name="requirements"
                placeholder="Requirements"
                value={editForm.requirements || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, requirements: e.target.value })
                }
                required
              />
              <Input
                name="notes"
                placeholder="Notes"
                value={editForm.notes || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, notes: e.target.value })
                }
                required
              />
              <Select
                value={editForm.customerId || ""}
                onValueChange={(val) =>
                  setEditForm({ ...editForm, customerId: val })
                }
                disabled={!allCustomers || allCustomers.length === 0}
                name="customerId"
                required
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !allCustomers
                        ? "Loading customers..."
                        : allCustomers.length === 0
                        ? "No customers available"
                        : "Select customer"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {!allCustomers && (
                    <SelectItem value="loading" disabled>
                      Loading customers...
                    </SelectItem>
                  )}
                  {allCustomers && allCustomers.length === 0 && (
                    <SelectItem value="none" disabled>
                      No customers available
                    </SelectItem>
                  )}
                  {allCustomers &&
                    allCustomers.length > 0 &&
                    allCustomers.map((c) => (
                      <SelectItem key={c._id} value={c._id!}>
                        {c.firstName} {c.lastName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Input
                name="dueDate"
                type="date"
                value={
                  editForm.dueDate ? String(editForm.dueDate).slice(0, 10) : ""
                }
                onChange={(e) =>
                  setEditForm({ ...editForm, dueDate: e.target.value })
                }
                required
              />
              {/* Status Select for Edit Task */}
              <Select
                value={editForm.status || ""}
                onValueChange={(val) =>
                  setEditForm({ ...editForm, status: val })
                }
                name="status"
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={editForm.userId || ""}
                onValueChange={(val) =>
                  setEditForm({ ...editForm, userId: val })
                }
                name="userId"
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign to user" />
                </SelectTrigger>
                <SelectContent>
                  {allUsers &&
                    (
                      allUsers as {
                        _id: string;
                        firstName: string;
                        lastName: string;
                        username: string;
                      }[]
                    ).map((u) => (
                      <SelectItem key={u._id} value={u._id}>
                        {u.firstName} {u.lastName} ({u.username})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button type="submit" disabled={editSubmitting}>
                  {editSubmitting ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          )}
          <DialogFooter>
            {!editMode && user?.isAdmin && (
              <div className="flex gap-2 w-full justify-between">
                <Button onClick={() => setEditMode(true)}>Edit</Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteTask}
                  disabled={deleteSubmitting}
                >
                  {deleteSubmitting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            )}
            <Button
              onClick={() => setSelectedTask(null)}
              disabled={deleteSubmitting}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
