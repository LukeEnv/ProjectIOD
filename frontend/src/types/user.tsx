export type User = {
  _id: string; // Add this line
  id?: string; // Keep for compatibility if needed
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
  isAdmin?: boolean;
};
