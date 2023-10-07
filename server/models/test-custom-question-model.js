const {Schema, model} = require('mongoose');

const TestCustomQuestionSchema = new Schema({
    answers: {type: Object, required: true},
    description: {type: String, required: true},
})

module.exports = model('TestCustomQuestion', TestCustomQuestionSchema);
