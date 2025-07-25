import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(` MongoDB connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(" MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
