const parseNumber = (number, defaultValue) => {
  const isString = typeof number === "string";

  if (!isString) return defaultValue;

  const parsedNumber = parseInt(number);
  if (Number.isNaN(parseNumber)) return defaultValue;

  return parsedNumber;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  const parsedPage = parseNumber(page);
  const parsedPerPage = parseNumber(perPage);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
