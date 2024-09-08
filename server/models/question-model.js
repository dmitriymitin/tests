const {Schema, model} = require('mongoose');

const QuestionSchema = new Schema({
    answers: {type: Object, required: true},
    answerType: {type: String, required: true},
    descriptionEditor: {type: Object, required: false},
    setting: {type: Object, required: false},
    groupId: {type: Array, required: false}
})

module.exports = model('QuestionSchema', QuestionSchema);
