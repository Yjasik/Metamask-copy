// backend/src/models/token.model.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IToken extends Document {
  userId: mongoose.Types.ObjectId; // владелец токена
  contractAddress: string;         // адрес контракта токена
  symbol: string;                  // символ токена (ETH, USDC...)
  name: string;                    // название (Ethereum, USD Coin...)
  decimals: number;                // количество знаков после запятой
  chainId: number;                 // идентификатор сети
  createdAt: Date;
  updatedAt: Date;
}

const tokenSchema = new Schema<IToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId обязателен'],
      index: true,
    },
    contractAddress: {
      type: String,
      required: [true, 'Адрес контракта обязателен'],
      lowercase: true,
    },
    symbol: {
      type: String,
      required: [true, 'Символ токена обязателен'],
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Название токена обязательно'],
    },
    decimals: {
      type: Number,
      required: [true, 'decimals обязателен'],
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

// Уникальность: один пользователь не может добавить один и тот же токен в одной сети дважды
tokenSchema.index({ userId: 1, contractAddress: 1, chainId: 1 }, { unique: true });

const Token = mongoose.model<IToken>('Token', tokenSchema);

export default Token;