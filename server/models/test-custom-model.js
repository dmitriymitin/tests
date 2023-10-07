const {Schema, model} = require('mongoose');

const TestCustomSchema = new Schema({
    title: {type: String, required: true},
    questions: {type: Array, required: false},
    status: {type: String, required: true, default: 'Start'},
    testKey: {type: String, required: false, default: ''}
})

module.exports = model('TestCustom', TestCustomSchema);
