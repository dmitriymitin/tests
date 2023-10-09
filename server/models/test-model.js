const {Schema, model} = require('mongoose');

const TestSchema = new Schema({
    firstQuestionTitle: {type: String, required: false},
    title: {type: String, required: true},
    quantityQuestion: {type: Number, required: true},
    status: {type: String, required: true, default: 'Start'},
    testKey: {type: String, required: false, default: ''},
    descriptionEditor: {type: Object, required: false}
})

module.exports = model('Test', TestSchema);
