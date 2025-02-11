/* eslint-disable linebreak-style */
import mongoose from 'mongoose';

export interface IProduct {
  title: string;
  image: {
    fileName: string;
    originalName: string;
  };
  category: string;
  description?: string;
  price?: number|null;
}

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    unique: true,
  },
  image: {
    fileName: {
      type: String,
    },
    originalName: {
      type: String,
    },
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    default: null,
    required: false,
  },
});

export default mongoose.model<IProduct>('product', productSchema);
