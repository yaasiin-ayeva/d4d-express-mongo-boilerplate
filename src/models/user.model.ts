import mongoose from "mongoose";
import validator from "validator";
import * as bcrypt from "bcryptjs";
import toJSON from "./plugins/toJSON.plugin";
import paginate from "./plugins/paginate.plugin";

const schema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate(value: any) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate(value: any) {
      if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        throw new Error('Password must contain at least one letter and one number');
      }
    },
    private: true,
  },
  picture: {
    type: String,
    required: false,
    trim: true,
  },
  enabled: {
    type: Boolean,
    required: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
},
  {
    timestamps: true,
  }
);

schema.plugin(toJSON);
schema.plugin(paginate);

schema.statics.isEmailTaken = async function (email: string): Promise<boolean> {
  const user = await this.findOne({ email });
  return !!user;
}

schema.methods.isPasswordMatch = async function (password: string): Promise<boolean> {
  const user = this;
  return bcrypt.compare(password, user.password);
}

schema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
})

const User = mongoose.model('User', schema);

export default User;