import mongoose, { Document, Schema, Model } from 'mongoose';

export interface BillingHistory {
    date: Date;
    amount: number;
    message: string;
    dueDate: Date;
}

export interface IClient extends Document {
    clientReferenceID: string;
    email: string;
    roles: string[];
    domain: string;
    saasProductName: string;
    billingHistory: BillingHistory[];
}

const BillingHistorySchema: Schema = new Schema({
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    message: { type: String, required: true },
    dueDate: { type: Date, required: true },
});
const ClientSchema: Schema = new Schema({
    clientReferenceID: {
        type: String,
        unique: true,
        required: [true, "Client ID is required."],
        validate: {
            validator: function (value: string) {
                return typeof value === 'string' && value.trim() !== '';
            },
            message: "Invalid Client ID. It must be a non-empty string.",
        },
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
    roles: { type: [String], required: true, default: [] },
    domain: { type: String, required: true },
    saasProductName: { type: String, required: true },
    billingHistory: { type: [BillingHistorySchema], default: [] },
}, { timestamps: true });
const ClientModel: Model<IClient> =
    mongoose.models.Client as Model<IClient> || mongoose.model<IClient>('Client', ClientSchema);

export { ClientModel };

