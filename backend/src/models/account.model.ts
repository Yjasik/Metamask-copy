// backend/src/models/account.model.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId; // ссылка на пользователя
  address: string;                 // публичный адрес кошелька
  encryptedPrivateKey: string;     // зашифрованный приватный ключ (AES-GCM, hex)
  iv: string;                      // вектор инициализации (hex)
  salt: string;                    // соль для PBKDF2 (hex)
  chainId: number;                 // идентификатор сети (например, 11155111 для Sepolia)
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId обязателен'],
      index: true,
    },
    address: {
      type: String,
      required: [true, 'Адрес кошелька обязателен'],
      lowercase: true,
    },
    encryptedPrivateKey: {
      type: String,
      required: [true, 'Зашифрованный приватный ключ обязателен'],
    },
    iv: {
      type: String,
      required: [true, 'IV обязателен'],
    },
    salt: {
      type: String,
      required: [true, 'Salt обязателен'],
    },
    chainId: {
      type: Number,
      required: [true, 'chainId обязателен'],
    },
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model<IAccount>('Account', accountSchema);

export default Account;