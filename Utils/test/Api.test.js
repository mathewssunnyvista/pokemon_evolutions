const Api = require("../../Utils/Api");

const result = { name: "Test" };
const basePath = "testExternalPath";

jest.mock("../../Utils/Api", () => {
  const original = jest.requireActual("../../Utils/Api");

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

describe("[Utils/Api]", () => {
  describe("Api::fetchEndPoint", () => {
    test("Check whether endpoints are concatinated with base path", () => {
      const identifier = "test";
      const expectedData = basePath + "/" + identifier;
      const url = Api.fetchEndPoint(identifier);
      expect(url).toBe(expectedData);
    });
  });

  describe("Api::fetchData", () => {
    test("Check whether fetchData returns resolved data", async () => {
      const response = await Api.fetchData()
      expect(response.data).toStrictEqual(result);
    });
  });
});
