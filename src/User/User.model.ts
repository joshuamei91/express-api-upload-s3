import mongoose from 'mongoose';  
const UserSchema = new mongoose.Schema({  
  name: String,
  email: String,
  password: String,
  avatar: String
});
const userModel = mongoose.model('User', UserSchema);

export default userModel;