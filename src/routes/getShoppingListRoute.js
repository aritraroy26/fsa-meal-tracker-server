import { getIngredients, getPopulatedMeals } from "../db";

const emptyIngredients = {
  count: 0,
  pounds: 0,
  cups: 0,
  tablespoons: 0,
  teaspoons: 0,
};

const condenseIngredients = (ingredients) =>
  ingredients.reduce(
    (accumulatedValue, ingredient) => ({
      ...accumulatedValue,
      [ingredient.name.toLowerCase()]: accumulatedValue[
        ingredient.name.toLowerCase()
      ]
        ? {
            ...accumulatedValue[ingredient.name.toLowerCase()],
            [ingredient.units]:
              accumulatedValue[ingredient.name.toLowerCase()][
                ingredient.units
              ] + ingredient.amount,
          }
        : { ...emptyIngredients, [ingredient.units]: ingredient.amount },
    }),
    {}
  );

const getMissingIngredients = (required, owned) =>
  Object.keys(required).reduce(
    (accumulatedValue, name) => ({
      ...accumulatedValue,
      [name]: Object.keys(required[name]).reduce(
        (unitAmounts, unit) => ({
          ...unitAmounts,
          [unit]: Math.max(
            required[name][unit] - ((owned[name] || {})[unit] || 0),
            0
          ),
        }),
        {}
      ),
    }),
    {}
  );

const getShoppingList = (missingIngredients) =>
  Object.keys(missingIngredients).map(
    (name) =>
      name +
      ": " +
      Object.keys(missingIngredients[name])
        .filter((unit) => missingIngredients[name][unit] > 0)
        .map((unit) => `${missingIngredients[name][unit]} ${unit}`)
        .join(" + ")
  );

export const getShoppingListRoute = {
  method: "get",
  path: "/shopping-list",
  handler: async (req, res) => {
    const ingredients = await getIngredients();
    const populatedMeals = await getPopulatedMeals();
    const futureMeals = populatedMeals.filter((meal) => {
      const mealDate = new Date(meal.plannedDate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return mealDate > yesterday;
    });

    const requiredIngredients = futureMeals.flatMap(
      (meal) => meal.recipe.ingredients
    );
    const condensedMealIngredients = condenseIngredients(requiredIngredients);
    const condensedUserIngredients = condenseIngredients(ingredients);
    const missingIngredients = getMissingIngredients(
      condensedMealIngredients,
      condensedUserIngredients
    );
    const shoppingList = getShoppingList(missingIngredients);

    res.status(200).json(shoppingList);
  },
};
