const Api = require("../../Utils/Api");
const EvolutionController = require("../EvolutionController");

// jest.mock("../../Utils/Api", () => {
//   fetchEndPoint: jest.fn().mockImplementation((url) => {
//     return url;
//   });
// });

jest.mock("../../Utils/Api", () => {
  const original = jest.requireActual("../../Utils/Api");
  const result = { name: "Test" };
  const basePath = "testExternalPath";
  return {
    ...original,
    fetchEndPoint: jest.fn().mockImplementation((url) => {
      return basePath + "/" + url;
    }),
    fetchData: jest
      .fn()
      .mockImplementation(() => Promise.resolve({ data: result })),
  };
});

describe("[Controller/EvolutionController]", () => {
  describe("EvolutionController:: processedData", () => {
    test("Check whether evolution with single chain - single way traversal are handled", () => {
      const levelOnePokemon = "caterpie";
      const levelTwoPokemon = "metapod";
      const levelThreePokemon = "butterfree";
      const data = {
        evolves_to: [
          {
            evolves_to: [
              {
                evolves_to: [],
                species: {
                  name: levelThreePokemon,
                },
              },
            ],
            is_baby: false,
            species: {
              name: levelTwoPokemon,
            },
          },
        ],
        species: {
          name: levelOnePokemon,
        },
      };

      const expectedData = [
        {
          name: levelTwoPokemon,
          variations: [
            {
              name: levelThreePokemon,
              variations: [],
            },
          ],
        },
      ];

      expect(EvolutionController.processedData(data)).toStrictEqual(
        expectedData
      );
    });

    test("Check whether evolution with multple chain - multiple variations traversal are handled", () => {
      const levelOnePokemon = "oddish";
      const levelTwoPokemon = "gloom";
      const levelThreePokemon1 = "vileplume";
      const levelThreePokemon2 = "bellossom";
      const data = {
        evolves_to: [
          {
            evolves_to: [
              {
                evolves_to: [],
                species: {
                  name: levelThreePokemon1,
                },
              },
              {
                evolves_to: [],
                species: {
                  name: levelThreePokemon2,
                },
              },
            ],
            is_baby: false,
            species: {
              name: levelTwoPokemon,
            },
          },
        ],
        species: {
          name: levelOnePokemon,
        },
      };

      const expectedData = [
        {
          name: levelTwoPokemon,
          variations: [
            {
              name: levelThreePokemon1,
              variations: [],
            },
            {
              name: levelThreePokemon2,
              variations: [],
            },
          ],
        },
      ];

      expect(EvolutionController.processedData(data)).toStrictEqual(
        expectedData
      );
    });
  });

});
