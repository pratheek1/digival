'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let examSchema = new Schema({
    question: {type: String},
    answer: [{type: mongoose.Types.ObjectId, ref: 'Answer'}],
    deleted: {type: Boolean, default: false},
    active: {type: Boolean, default: true}
})

module.exports = mongoose.model('Exam', examSchema);