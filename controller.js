const express = require('express');
const router = express.Router();
const ArtworkModel = require('./artworkModel');
const bodyParser = require('body-parser');
const morgan = require('morgan');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(morgan('tiny'));

router.get('/', async (req, res) => {
    try {
        const artworks = await ArtworkModel.find({});
        if (artworks.length !== 0) {
            res.json(artworks);
        } else {
            res.status(404).send('No artworks found');
        }
    } catch (err) {
        res.status(500).send('Internal server error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const artwork = await ArtworkModel.findOne({ id: req.params.id });
        if (artwork) {
            res.json(artwork);
        } else {
            res.status(404).send('Artwork not found');
        }
    } catch (err) {
        res.status(500).send('Internal server error');
    }
});

router.post('/', async (req, res) => {
    try {
        const newArtWork = new ArtWork(req.body);
        await newArtWork.save();
        res.status(201).json(newArtWork);
    } catch (err) {
        res.status(500).send('Internal server error');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedArtWork = await ArtworkModel.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (updatedArtWork) {
            res.status(204).json(updatedArtWork);
        } else {
            res.status(404).send('Artwork not found');
        }
    } catch (err) {
        res.status(500).send('Internal server error');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const removedArtWork = await ArtworkModel.findOneAndRemove({ id: req.params.id });
        if (removedArtWork) {
            res.json(removedArtWork);
        } else {
            res.status(404).send('Artwork not found');
        }
    } catch (err) {
        res.status(500).send('Internal server error');
    }
});

module.exports = router;