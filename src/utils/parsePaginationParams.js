// const parseNumber = (number, defaultValue) => {
//   const isString = typeof number === "string";

//   if (!isString) return defaultValue;

//   const parsedNumber = parseInt(number);
//   if (Number.isNaN(parsedNumber)) return defaultValue;

//   return parsedNumber;
// };

// export const parsePaginationParams = (query) => {
//   const { page, perPage } = query;

//   const parsedPage = parseNumber(page, 1);
//   const parsedPerPage = parseNumber(perPage, 10);

//   return {
//     page: parsedPage,
//     perPage: parsedPerPage,
//   };
// };

const parseNumber = (value, defaultValue = 1) => {
  const parsed = parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    return defaultValue;
  }

  return parsed;
};

export const parsePaginationParams = (query) => {
  return {
    page: parseNumber(query.page, 1),
    perPage: parseNumber(query.perPage, 10),
  };
};
