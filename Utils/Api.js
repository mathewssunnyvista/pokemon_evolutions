const axios = require("axios");
const createError = require("http-errors");

module.exports = {
  fetchData: async (url) => {
    try {
      const response = await axios.get(url).then((response) => {
        return response.data;
      });

      if (!response) {
        throw createError(404, "Product does not exist.");
      }

      return response;
    } catch (error) {}
  },
};
