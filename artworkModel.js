const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const artworkSchema = new mongoose.Schema({
    Id: {
        type: Number,
        required: true,
        unique: true
    },
    ImageBytes: {
        type: String,
        required: true
    },
    ImageUrl: {
        type: String,
        required: true
    },
    IsFeatured: {
        type: Boolean,
        required: true
    },
    CreatedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
});

module.exports = mongoose.model('Artwork', artworkSchema);