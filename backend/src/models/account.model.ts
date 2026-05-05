import mongoose, { Document, Schema } from 'mongoose';

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId; 
  address: string;                
  encryptedPrivateKey: string;     
  iv: string;                    
  salt: string;                   
  chainId: number;                
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      index: true,
    },
    address: {
      type: String,
      required: [true, 'Wallet address is required'],
      lowercase: true,
    },
    encryptedPrivateKey: {
      type: String,
      required: [true, 'Encrypted private key is required'],
    },
    iv: {
      type: String,
      required: [true, 'IV is required'],
    },
    salt: {
      type: String,
      required: [true, 'Salt is required'],
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

const Account = mongoose.model<IAccount>('Account', accountSchema);

export default Account;