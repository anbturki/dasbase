import { Schema, model, Model, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
}

interface IUserModel extends Model<IUserDocument> {
  comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

/**
 * Before save
 */
userSchema.pre('save', async function (this: IUserDocument, next) {
  if (this.isNew || this.isModified('password')) {
    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  }
});

/**
 * Methods
 */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

/**
 * Compare password
 */

userSchema.static(
  'comparePassword',
  async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    const isMatch = await bcryptjs.compare(plainPassword, hashedPassword);
    return isMatch;
  },
);

const user: IUserModel = model<IUserDocument, IUserModel>('User', userSchema);

export default user;
