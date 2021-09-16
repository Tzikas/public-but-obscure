const { Schema, model } = require('mongoose');

const reviewSchema = new Schema({
    message: String,
    rating: Number,
    name: String
})

module.exports = model('Review', reviewSchema);