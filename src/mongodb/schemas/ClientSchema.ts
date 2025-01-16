
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IClient extends Document {
  clientReferenceID: string;
  email: string;
  companyName: string;
  serviceType: string;
  domain: string;
  saasProductName: string;
  password: string;
  products?: string;
  roles: string[];
  cinNumber: string;
  gst: number;
  address: string;
  contact: number;
  state: string;
  panNo: string;
}

interface Client {
  serviceType: string;
}
const clientSchema: Schema = new Schema({
  clientReferenceID: {
    type: String,
    unique: true, // Enforces uniqueness for the field
    required: [true, "client Id is required."], // Custom error message for required validation
    validate: {
      validator: function (value: string) {
        return typeof value === 'string' && value.trim() !== ''; // Basic validation for non-empty string
      },
      message: "Invalid client Id. It must be a non-empty string.",
    },
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    validate: {
      validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: "Invalid email format.",
    },
  },
  companyName: {
    type: String,
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['webApp', 'saasProduct'],
  },
  domain: {
    type: String,
  },
  saasProductName: {
    type: String,
    default: null,
    required: function (this: Client) {
      return this.serviceType === 'saasProduct';
    },
  },
  gst: {
    type: Number,
    required: true,
    min: [0, "GST must be a non-negative number."],
  },
  address: {
    type: String,
    required: [true, "Address is required."],
  },

  contact: {
    type: Number,
    required: [true, "Contact number is required."],
    validate: {
      validator: function (value: number) {
        const phoneRegex = /^[1-9][0-9]{9}$/;
        return phoneRegex.test(value.toString());
      },
      message: "Invalid contact number format.",
    },
  },

  cinNumber: {
    type: String,
    required: [true, "CIN number is required."],
    unique: true,
    validate: {
      validator: function (value: string) {
        const cinRegex = /^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/;
        return cinRegex.test(value);
      },
      message: "Invalid CIN number format.",
    },
  },

  panNo: {
    type: String,
    required: [true, "PAN number is required."],
    unique: true,
    validate: {
      validator: function (value: string) {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return panRegex.test(value);
      },
      message: "Invalid PAN number format.",
    },
  },
  state: {
    type: String,
    required: [true, "State is required."],
    validate: {
      validator: function (value: string) {
        return typeof value === 'string' && value.trim() !== '';
      },
      message: "Invalid state. It must be a non-empty string.",
    },
  },

  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: [8, "Password must be at least 8 characters long."],
    validate: {
      validator: (value: string) =>
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value) &&
        /[0-9]/.test(value) &&
        /[!@#$%^&*]/.test(value),
      message:
        "Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
    },
  },
  roles: {
    type: [String],
    default: ['CLIENT'],
    validate: {
      validator: function (roles: string[]) {
        return roles.every((role) =>
          ['ADMIN', 'CLIENT'].includes(role)
        );
      },
      message: 'Invalid role provided.',
    },
  }
});
clientSchema.pre<IClient>('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    } catch (error) {
      return next(error as Error); // Pass the error to the next middleware
    }
  }
  next();
});
export const Client = mongoose.models.Client || mongoose.model<IClient>('Client', clientSchema);

