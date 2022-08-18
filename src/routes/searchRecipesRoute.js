import { searchRecipes } from "../db";

export const searchRecipesRoute = {
  path: "/recipes",
  method: "get",
  handler: async (req, res) => {
    const searchString = req.query.search;
    const result = await searchRecipes(searchString);
    res.status(200).json(result);
  },
};
