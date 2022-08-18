import { insertMeal, getPopulatedMeals } from "../db";

export const addMealRoute = {
  path: "/meals",
  method: "post",
  handler: async (req, res) => {
    const { recipeId, date } = req.body;
    const newMeal = {
      recipeId,
      plannedDate: date,
    };
    await insertMeal(newMeal);
    const updatedMeals = await getPopulatedMeals();
    res.status(200).json(updatedMeals);
  },
};
