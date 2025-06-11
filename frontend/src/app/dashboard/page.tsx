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

export default function Dashboard() {
  const { tasks, isLoading, isError, createTask } = useTasksContext();
  const { user, createCustomer } = useUserContext();
  const { data: allUsers } = useAllUsers();
  const { data: allCustomers } = useAllCustomers();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Task>>({});
  const [submitting, setSubmitting] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState<Partial<Customer>>({});
  const [customerSubmitting, setCustomerSubmitting] = useState(false);

  const taskArray: Task[] = Array.isArray(tasks) ? tasks : [];

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
            <select
              name="customerId"
              value={form.customerId || ""}
              onChange={handleChange}
              required
            >
              <option value="">Select customer</option>
              {allCustomers &&
                allCustomers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
            <Input
              name="dueDate"
              type="date"
              value={form.dueDate ? form.dueDate.slice(0, 10) : ""}
              onChange={handleChange}
              required
            />
            <Input
              name="status"
              placeholder="Status"
              value={form.status || ""}
              onChange={handleChange}
              required
            />
            <select
              name="userId"
              value={form.userId || ""}
              onChange={handleChange}
              required
            >
              <option value="">Assign to user</option>
              {allUsers &&
                (allUsers as import("@/types/user").User[]).map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.username})
                  </option>
                ))}
            </select>
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
                <TableRow key={task._id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{task.requirements}</TableCell>
                  <TableCell>{task.notes}</TableCell>
                  <TableCell>{task.customerId}</TableCell>
                  <TableCell>
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>
                    {task.user?.firstName} {task.user?.lastName} (
                    {task.user?.username})
                  </TableCell>
                  <TableCell>
                    {task.createdByUser?.firstName}{" "}
                    {task.createdByUser?.lastName} (
                    {task.createdByUser?.username})
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
