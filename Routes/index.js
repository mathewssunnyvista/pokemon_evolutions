const express = require('express');
const router = express.Router();

const EvolutionController = require('../Controller/EvolutionController');

//Get a list of all products
router.get('/evolutionChain/:id', EvolutionController.getEvolutionChain);

router.get('/evolution/:name', EvolutionController.getEvolution);

router.get('/species/:name', EvolutionController.getSpecies);


module.exports = router;