import { db } from "./db";

export const searchRecipes = async (searchString) => {
  const searchQuery =
    searchString !== "" ? { $text: { $search: searchString } } : {};
  const meals = db
    .getConnection()
    .collection("recipes")
    .find(searchQuery)
    .toArray();
  return meals;
};
