import { Document } from "mongoose";

export interface ICustomer extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    address: string;

    createdAt: Date;
    updatedAt: Date;
}
