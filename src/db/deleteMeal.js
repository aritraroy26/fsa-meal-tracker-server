import { db } from "./db";
import { ObjectId } from "mongodb";

export const deleteMeal = async (mealId) => {
  const connection = db.getConnection();
  await connection.collection("meals").deleteOne({ _id: ObjectId(mealId) });
};
