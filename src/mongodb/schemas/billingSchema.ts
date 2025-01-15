import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IBilling extends Document {
    clientReferenceID: string;
    companyName: string;
    date: Date;
    amount: number;
}
const billingSchema: Schema = new Schema(
    {
        clientReferenceID: {
            type: String,
            required: [true, 'Billing Reference ID is required.'],
        },

        companyName: {
            type: String,
            required: [true, 'Company Name is required.'],
        },

        date: {
            type: Date,
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },


    },
    { timestamps: true }
);
export const Billing: Model<IBilling> =
    mongoose.models.Billing || mongoose.model<IBilling>('Billing', billingSchema);