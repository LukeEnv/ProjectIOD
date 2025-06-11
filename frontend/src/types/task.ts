export interface Task {
  _id: string;
  title: string;
  requirements: string;
  notes: string;
  customerId: string;
  dueDate: string;
  status: string;
  userId: string;
  user?: import("./user").User; // Populated user object (optional)
  createdBy: string; // User ID of creator
  createdByUser?: import("./user").User; // Populated creator user object (optional)
  createdAt: string;
  updatedAt: string;
}
