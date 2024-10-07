const {Schema, model} = require('mongoose');

const QuestionSchema = new Schema({
    answers: {type: Object, required: true},
    answerType: {type: String, required: true},
    descriptionEditor: {type: Object, required: false},
    setting: {type: Object, required: false},
    groupsId: {type: Array, required: false},
    convertId: {type: String, required: false},
})

module.exports = model('QuestionSchema', QuestionSchema);
