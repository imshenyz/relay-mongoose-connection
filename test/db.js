import mongoose from 'mongoose';

export const connect = async () => {
  return mongoose.connect(process.env.MONGO_CONNECTION_STRING);
};
