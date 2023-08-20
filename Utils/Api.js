const axios = require("axios");
const createError = require("http-errors");

const EXTERNAL_API_BASE_URL = process.env.EXTERNAL_API_BASE_URL;

module.exports = {
  fetchEndPoint: (identifier) => {
    return `${EXTERNAL_API_BASE_URL}/${identifier}`;
  },

  fetchData: async (url) => {
    try {
      const response = await axios
        .get(url)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          return error;
        });

      return response;
    } catch (error) {
      console.log(error);
    }
  },
};
