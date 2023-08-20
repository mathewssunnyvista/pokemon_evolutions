

const Api = require("../Utils/Api");

const dotenv = require("dotenv").config();

const EXTERNAL_API_BASE_URL = process.env.EXTERNAL_API_BASE_URL;

module.exports = {
  getEvolutionChain: async (req, res, next) => {
    try {
      const id = req.params.id;
      //  res.json({ dddd: "dddd" });
      const url = `${EXTERNAL_API_BASE_URL}/evolution-chain/${id}`;
      const response = await Api.fetchData(url).then((response) => response);
      //   // const product = await Product.findOne({ _id: id });
  
      res.send(response);
    } catch (error) {
      //   console.log(error.message);
      //   if (error instanceof mongoose.CastError) {
      //     next(createError(400, 'Invalid Product id'));
      //     return;
      //   }
      //   next(error);
    }
  },
};
