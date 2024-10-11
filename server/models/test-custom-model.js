const {Schema, model} = require('mongoose');

const TestCustomSchema = new Schema({
    firstQuestionTitle: {type: String, required: false},
    title: {type: String, required: true},
    status: {type: String, required: true, default: 'Start'},
    testKey: {type: String, required: false, default: ''},
    createDate: {type: String, required: false},
    updateDate: {type: String, required: false},
    folderId: {type: String, required: false},
    testType: {type: String, required: false},
    questionsId: {type: Array, required: false, default: []},
    setting: {type: Object, required: false, default: {}}
})

module.exports = model('TestCustom', TestCustomSchema);
