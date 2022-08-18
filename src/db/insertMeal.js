import { db } from "./db";

export const insertMeal = async (meal) => {
  await db.getConnection().collection("meals").insertOne(meal);
};
