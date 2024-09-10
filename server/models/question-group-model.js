const {Schema, model} = require('mongoose');

const QuestionGroupSchema = new Schema({
    name: {type: String, required: true},
    count: {type: Number, required: false, default: 0},
})

module.exports = model('QuestionGroupSchema', QuestionGroupSchema);
