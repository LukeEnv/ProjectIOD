export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string; // Optional for security reasons, not returned in user data
  createdAt: string;
  updatedAt: string;
  isAdmin?: boolean;
};
