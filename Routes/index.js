const express = require('express');
const router = express.Router();

const EvolutionController = require('../Controller/EvolutionController');

//Get evolution chain of provided pokemon names
router.get('/evolutionChain/:name', EvolutionController.getEvolution);


module.exports = router;