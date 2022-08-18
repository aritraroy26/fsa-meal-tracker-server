import { db } from "./db";

export const insertIngredient = async (ingredient) => {
  await db.getConnection().collection("ingredients").insertOne(ingredient);
};
