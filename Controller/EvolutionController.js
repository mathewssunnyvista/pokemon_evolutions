const Api = require("../Utils/Api");
const createError = require("http-errors");
const _ = require("lodash");
const { isEmpty } = require("lodash");

const dotenv = require("dotenv").config();

module.exports = {
  /**
   * Function helps to traverse through evolution data
   * This is a recursive function which takes evolution data and traverse till evolve_to reach empty array
   * @param {Array} data
   * @return {Array} chainData
   */
  processedData: (data) => {
    const chainData = {
      name: data.species.name,
      variations: [],
    };
    if (data?.evolves_to?.length > 0) {
      data.evolves_to.forEach((evolution) => {
        const variation = {
          name: evolution.species.name,
          variations: module.exports.processedData(evolution),
        };
        chainData.variations.push(variation);
      });
    }
    return chainData.variations;
  },
  /**
   * Function fetch evolution data from provided pokemon name
   * This is a recursive function which takes evolution data and traverse till evolve_to reach empty array
   * @param {Request} req
   * @param {Request} res
   * @return {Response} evolutionChainResponse
   */
  getEvolution: async (req, res) => {
    try {
      // The pokemon name needs to be used to fetch its species details which will give the evolution chain url.
      const response = await module.exports.getSpecies(req);

      //Handles the data not found when invalid pokemon names are provided.
      if (response.status !== 200) {
        res.status(204);
        res.send({ message: response.response.data });
      } else {
        if (response.data) {
          const { evolution_chain } = response.data;
          // The evolution chain url from the species details is used to fetch the pokemon evolution chain data
          const evolutionChainResponse = await module.exports.getEvolutionChain(
            evolution_chain
          );
          res.send(evolutionChainResponse);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  },
  /**
   * Function fetch species data from provided pokemon name
   * @param {Request} req
   * @param {Request} res
   * @return {Response} response
   */
  getSpecies: async (req) => {
    try {
      // Sanitized the user input as the external pokemon api is case sensitive
      const name = module.exports.getSanitized(req.params.name);
      if (!isEmpty(name)) {
        const url = Api.fetchEndPoint(`pokemon-species/${name}`);
        const response = await Api.fetchData(url).then((response) => {
          return response;
        });

        return response;
      }
    } catch (error) {
      console.log(error.message);
    }
  },
  /**
   * Function fetch evolution data from provided evolution_chain url
   * @param {string} evolution_chain
   * @return {Object} response
   */
  getEvolutionChain: async (evolution_chain) => {
    if (!_.isNull(evolution_chain)) {
      const response = await Api.fetchData(evolution_chain?.url).then(
        (response) => response
      );

      if (response.status !== 200) {
        throw createError(response.response.status, response.message);
      } else {
        const evChain = module.exports.processedData(response.data?.chain);
        return {
          name: response.data?.chain?.species?.name,
          variations: evChain,
        };
      }
    }
  },
  /**
   * Function sanitize the user request params
   * @param {string} data
   * @return {string} data
   */
  getSanitized: (data) => {
    return data.toLowerCase().trim();
  },
};
