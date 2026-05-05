import mongoose, { Document, Schema } from 'mongoose';

export interface IToken extends Document {
  userId: mongoose.Types.ObjectId; 
  contractAddress: string;      
  symbol: string;                  
  name: string;                
  decimals: number;             
  chainId: number;          
  createdAt: Date;
  updatedAt: Date;
}

const tokenSchema = new Schema<IToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      index: true,
    },
    contractAddress: {
      type: String,
      required: [true, 'Contract address is required'],
      lowercase: true,
    },
    symbol: {
      type: String,
      required: [true, 'Token symbol is required'],
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Token name is required'],
    },
    decimals: {
      type: Number,
      required: [true, 'decimals is required'],
    },
    chainId: {
      type: Number,
      required: [true, 'chainId is required'],
    },
  },
  {
    timestamps: true,
  }
);

tokenSchema.index({ userId: 1, contractAddress: 1, chainId: 1 }, { unique: true });

const Token = mongoose.model<IToken>('Token', tokenSchema);

export default Token;