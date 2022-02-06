'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    value: {type: 'String'},
    isCorrectAns: {type: Boolean},
    deleted: {type: Boolean, default: false},
    questionId: {type: mongoose.Types.ObjectId, ref: 'Exam'},
    order: {type: Number}
})
module.exports = mongoose.model('Answer', answerSchema);