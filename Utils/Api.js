const axios = require("axios");
const createError = require("http-errors");

module.exports = {
  fetchData: async (url) => {
    try {
      const response = await axios.get(url).then((response) => {
        return response.data;
      });

      if (!response) {
        throw createError(404, "Response not avaible.");
      }

      return response;
    } catch (error) {
      console.log(error.code)
      //throw createError(503, "API not working");
    }
  },
};
