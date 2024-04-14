import mongoose from "mongoose";
import { app } from "./app";

const port = 3000;

const starUp = async () => {
  if(!process.env.JWT_KEY){
    throw new Error('JWT_KEY must be defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err); 
  }

  app.listen(port, () => {
    console.log("Auth app version 9");
    console.log(`Auth app listening on port ${port}!`);
  });
};

starUp();
