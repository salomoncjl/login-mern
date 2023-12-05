import dotenv from 'dotenv'
dotenv.config();
import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log(">>> DB is connected");
    } catch (error) {
        console.log(error);
    }
};