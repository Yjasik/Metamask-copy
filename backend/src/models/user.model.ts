// backend/src/models/user.model.ts

import mongoose, { Document, Schema } from 'mongoose';

// Интерфейс для TypeScript
export interface IUser extends Document {
  email: string;
  passwordHash: string;
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email обязателен'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Хеш пароля обязателен'],
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // автоматически добавляет createdAt и updatedAt
  }
);

// Создаём модель
const User = mongoose.model<IUser>('User', userSchema);

export default User;