import mongoose from "mongoose";

const connectDB = async () => {
  const options = {
    useNewUrlParser: true,
    autoIndex: false,
    maxPoolSize: 10,
  };
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDB;
