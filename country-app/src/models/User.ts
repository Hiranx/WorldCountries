import { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { 
    type: String, 
    required: true,
    select: false,
    minlength: [6, 'Password must be at least 6 characters']
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  favorites: [{
    country: { type: String, required: true },
    flag: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    default: "user" 
  },
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: unknown) {
    next(error as Error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default models.User || model("User", UserSchema);