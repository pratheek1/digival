'use strict';

const async = require('async');
const _  = require('lodash');
const mongoose = require('mongoose');
const questionModel = require('./questionModel');
const answerModel = require('./answerModel');
const { find } = require('lodash');

exports.createQuestions = function(req, res) {
    let inputDate = req.body;

    async.waterfall([
        function(next) {
            const answers = inputDate.answers;
            answerModel.create(answers, function(err, data) {
                if(err) {
                    return next(err);
                }
                return next(err, data);
            })
        },
        function(answers, next) {
            let question = inputDate.question;
            let createObj = {
                question: question,
                answer: answers
            }
            questionModel.create(createObj, function(err, data) {
                if(err) {
                    return next(err);
                }
                return next(err, answers, data);
            })
        },
        function(answers, question, next) {
            const questionId = question._id;
            const answerIds = _.map(answers, '_id');
            const findQuery = {_id: {'$in': answerIds}};
            const updateObj = {questionId};
            answerModel.updateMany(findQuery, {'$set': updateObj}, function(err, data) {
                if(err) {
                    return next(err);
                }
                return next(err)
            })
        }
    ], function done(err) {
        if(err) {
            return res.status(500).send('Error occurred while creating questions');
        }
        return res.status(200).send('Successfully created');
    })
}

exports.getAllQuestions = function(req, res) {
    const findQuery = {active: true, deleted: false};
    questionModel.find(findQuery)
    .lean()
    .populate('answer')
    .exec(function(err, data) {
        if(err) {
            return res.status(500).send('Error occurred while fetching questions');
        }
        return res.status(200).send(data);
    })
}

exports.updateQuestion = function(req, res) {
    const questionId = req.params.questionId;
    const inputDate = req.body;
    async.waterfall([
        function(next) {
            const answers = inputDate.answer;
            let updatesAnswers = [];
            async.eachSeries(answers, function(answer, iteratorNext){
                let findQuery = {'_id': answer._id};
                if(!answer._id) {
                    answer['questionId'] = questionId;
                    answerModel.create(answer, function(err, data) {
                        if(err) {
                            return iteratorNext(err);
                        }
                        updatesAnswers.push(data);
                        return iteratorNext(err);
                    })
                } else {
                    answerModel.findOneAndUpdate(findQuery, {'$set':answer}, function(err, data) {
                        if(err) {
                            return iteratorNext(err);
                        }
                        updatesAnswers.push(data);
                        return iteratorNext(err);
                    })
                }
            }, function done(err) {
                if(err) {
                    return next(err);
                }
                next(err, updatesAnswers)
            })
        },
        function(updatesAnswers, next) {
            let findQuery = {'_id': questionId};
            let answerIds = _.map(updatesAnswers, '_id');
            let updateObj = {
                question: inputDate.question,
                answer: answerIds
            }
            questionModel.update(findQuery, {'$set': updateObj}, function(err, data) {
                if(err) {
                    return next(err);
                }
                return next(err);
            })
        }
    ], function done(err) {
        if(err) {
            return res.status(500).send('Error occurred while updating questions');
        }
        return res.status(200).send('Successfully updated question');
    })
}

exports.deleteQuestion = function(req, res) {
    const questionId = req.params.questionId;
    async.waterfall([
        function(next) {
            const findQuery = {_id: questionId};
            questionModel.deleteOne(findQuery, function(err, data) {
                if(err) {
                    return next(err);
                }
                return next(err);
            })
        },
        function(next) {
            const findQuery = {questionId: questionId};
            answerModel.deleteMany(findQuery, function(err, data) {
                if(err) {
                    return next(err);
                }
                return next(err);
            })
        }
    ], function done(err) {
        if(err) {
            return res.status(500).send('Error occurred while deleting questions');
        }
        return res.status(200).send('Successfully deleted question');
    })
}

exports.shuffleAnswers = function(req, res) {
    const questionId = req.params.questionId;
    async.waterfall([
        function(next) {
            const findQuery = {questionId};
            answerModel.find(findQuery)
            .lean()
            .exec(function(err, data) {
                if(err) {
                    return next(err);
                }
                next(err, data);
            })
        },
        function(answers, next) {
            let random = answers.map(({ order }) => order);        
            answers.forEach((o) => {
                o.order = random.splice(Math.floor(Math.random() * random.length), 1)[0];
            });
            async.eachSeries(answers, function(answer, iteratorNext) {
                const findQuery = answer._id;
                const updateObj = {order: answer.order}
                answerModel.findOneAndUpdate(findQuery, {'$set': updateObj}, function(err, data) {
                    if(err) {
                        return iteratorNext(err);
                    }
                    return iteratorNext(err)
                })
            }, function done(err) {
                if(err) {
                    return next(err);
                }
                return next(err);
            })
        }
    ], function done(err) {
        if(err) {
            return res.status(500).send('Error occured while shuffling answers');
        }
        return res.status(201).send('Successfully shuffled answers');
    })
}