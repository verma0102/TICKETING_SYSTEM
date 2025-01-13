import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IBilling extends Document {
    clientReferenceID: string;
    email: string;
    date: Date;
    amount: number;
    message: string;
    dueDate: Date;
}
const billingSchema: Schema = new Schema(
    {
        clientReferenceID: {
            type: String,
            required: [true, 'Billing Reference ID is required.'],
        },

        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (value: string) =>
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: "Invalid email format.",
            },
        },

        date: {
            type: Date,
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        message: {
            type: String,
            required: true,
        },

        dueDate: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);
export const Billing: Model<IBilling> =
    mongoose.models.Billing || mongoose.model<IBilling>('Billing', billingSchema);