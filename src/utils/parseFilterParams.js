export const parseFilterParams = (query) => {
  const { isFavourite } = query;
  const filter = {};

  if (typeof isFavourite !== "undefined") {
    if (isFavourite === "true") {
      filter.isFavourite = true;
    } else if (isFavourite === "false") {
      filter.isFavourite = false;
    } else {
      throw new Error("Invalid value for isFavourite. Use true or false.");
    }
  }

  return filter;
};
