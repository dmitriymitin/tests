const {Schema, model} = require('mongoose');

const QuestionGroupSchema = new Schema({
    name: {type: String, required: true}
})

module.exports = model('QuestionGroupSchema', QuestionGroupSchema);
