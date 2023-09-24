import mongoose from "mongoose";

export default async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;

    connection.on("open", () => {
      console.log("MogoDB is connected!");
    });

    connection.on("error", (e) => {
      console.log("Something went wrong!" + e);
      process.exit();
    });
  } catch (error) {
    console.log("Something went wrong!");
  }
}
