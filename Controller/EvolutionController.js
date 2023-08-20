const Api = require("../Utils/Api");
const _ = require("lodash");
const { isEmpty } = require("lodash");

const dotenv = require("dotenv").config();

const EXTERNAL_API_BASE_URL = process.env.EXTERNAL_API_BASE_URL;

const getEvolution = (evolutionChain, data) => {
  try {
    const speciesValue = { name: data.species.name };
    evolutionChain.push(speciesValue);
    let numberOfEvolutions = data?.evolves_to?.length;
    
    if (numberOfEvolutions) {
      console.log("inside 1");
      speciesValue.variations = [];
    }

        // if (evolutionChain.length > 0) {
    //   evolutionChain[evolutionChain?.length - 1].variations.push(speciesValue);
    // } else {
    //   evolutionChain.push(speciesValue);
    // }

    // console.log("speciesValue", data.species.name);
    // console.log("numberOfEvolutions", numberOfEvolutions);
    // console.log("evolutionChain", evolutionChain);
    // //Need to add variation
    // if (numberOfEvolutions) {
    //   console.log("inside 1");
    //   speciesValue.variations = [];
    // }
    // if (evolutionChain.length > 0) {
    //   evolutionChain[evolutionChain?.length - 1].variations.push(speciesValue);
    // } else {
    //   evolutionChain.push(speciesValue);
    // }

    // if (evolutionChain.length > 0) {
    //   console.log("inside 2", evolutionChain);
    // } else {
    //   console.log("inside 3");
    //   evolutionChain.push(speciesValue);
    // }

    // if (evolutionChain.length === 0) {
    //   evolutionChain.push({
    //     name: data.species.name,
    //     variations: [],
    //   });
    // } else {
    //   evolutionChain.variations.push({
    //     name: data.species.name,
    //     variations: [],
    //   });
    // }

    if (numberOfEvolutions) {
      const evolutionChainData = data.evolves_to[0];
      getEvolution(evolutionChain, evolutionChainData);
      if (numberOfEvolutions > 1) {
        for (let i = 1; i < numberOfEvolutions; i++) {
          const evolutionChainData = data.evolves_to[i];
          getEvolution(evolutionChain, evolutionChainData);
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getEvolution: async (req, res, next) => {
    const evolutionChain = [];
    const speciesResponse = await module.exports.getSpecies(req);

    const { evolution_chain } = speciesResponse;
    const evolutionChainResponse = await module.exports.getEvolutionChain(
      evolutionChain,
      evolution_chain
    );

    const result = module.exports.getFormatEvolutionChain(
      evolutionChainResponse
    );

    res.send(JSON.stringify(result));
  },

  getSpecies: async (req, res, next) => {
    try {
      const name = req.params.name;
      if (!isEmpty(name)) {
        const url = `${EXTERNAL_API_BASE_URL}/pokemon-species/${name}`;
        const response = await Api.fetchData(url)
          .then((response) => {
            //Need to throw error when response is undefined.
            // if (response == undefined) {
            //   next(createError(400, "Invalid Pokemon Name"));
            // }

            return response;
          })
          .catch((response) => {
            // console.log("inside catch");
            // console.log(response);
          });
        return response;
      }
    } catch (error) {
      console.log(error.message);
    }
  },

  getEvolutionChain: async (evolutionChain, evolution_chain) => {
    if (!_.isNull(evolution_chain)) {
      const response = await Api.fetchData(evolution_chain?.url).then(
        (response) => response
      );
      const evolutionChainData = response?.chain;
      getEvolution(evolutionChain, evolutionChainData);
      //res.send(JSON.stringify(evolutionChain));
      return evolutionChain;
    }
  },

  getFormatEvolutionChain: (data) => {
    try {
      // const result = [];
      // data.map((item,index) => {
      //   if(index !==0) {
      //     const variation = {"variations": [item]}
      //     result.push(variation);
      //   } else {
      //     result.push(item);
      //   }

      // });
      return data;
    } catch (error) {
      console.log(error.message);
    }
  },
};
