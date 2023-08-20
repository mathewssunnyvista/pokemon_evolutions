const Api = require("../Utils/Api");
const createError = require("http-errors");
const _ = require("lodash");
const { isEmpty } = require("lodash");

const dotenv = require("dotenv").config();

const processedData = (data) => {
  const chainData = {
    name: data.species.name,
    variations: [],
  };
  if (data?.evolves_to?.length > 0) {
    data.evolves_to.forEach((evolution) => {
      const variation = {
        name: evolution.species.name,
        variations: processedData(evolution),
      };
      chainData.variations.push(variation);
    });
  }
  return chainData.variations;
};

module.exports = {
  getEvolution: async (req, res, next) => {
    try {
      const response = await module.exports.getSpecies(req);

      if (response.status !== 200) {
        throw createError(response.response.status, response.message);
      } else {
        if (response.data) {
          const { evolution_chain } = response.data;

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

  getSpecies: async (req, res, next) => {
    try {
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

  getEvolutionChain: async (evolution_chain) => {
    if (!_.isNull(evolution_chain)) {
      const response = await Api.fetchData(evolution_chain?.url).then(
        (response) => response
      );

      if (response.status !== 200) {
        throw createError(response.response.status, response.message);
      } else {
        const evChain = processedData(response.data?.chain);
        return {
          name: response.data?.chain?.species?.name,
          variations: evChain,
        };
      }
    }
  },

  getSanitized: (data) => {
    return data.toLowerCase().trim();
  },
};
