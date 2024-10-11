const {Schema, model} = require('mongoose');

const TestSchema = new Schema({
    firstQuestionTitle: {type: String, required: false},
    title: {type: String, required: true},
    quantityQuestion: {type: Number, required: true},
    status: {type: String, required: true, default: 'Start'},
    testKey: {type: String, required: false, default: ''},
    descriptionEditor: {type: Object, required: false},
    testType: {type: String, required: false},
    createDate: {type: String, required: false},
    updateDate: {type: String, required: false},
    folderId: {type: String, required: false}
})

module.exports = model('Test', TestSchema);
