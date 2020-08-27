import Mongoose from "mongoose";

export interface User extends Mongoose.Document {
  id: string;
  developer: boolean;
}

export default Mongoose.model<User>(
  "User",
  new Mongoose.Schema({
    id: { required: true, type: String },
    developer: { default: false, type: Boolean },
  })
);
