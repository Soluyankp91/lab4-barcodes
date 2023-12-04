const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const entitySchema = mongoose.Schema({
    id: String,
    id_: ObjectId
})

let Entity = mongoose.model('entities', entitySchema, 'entities');

module.exports = { Entity };