const {Schema, model} = require('mongoose');

const TestSchema = new Schema({
    title: {type: String, required: true},
    quantityQuestion: {type: Number, required: true},
    status: {type: String, required: true, default: 'Start'},
    testKey: {type: String, required: false, default: ''}
})

module.exports = model('Test', TestSchema);
