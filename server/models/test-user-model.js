const {Schema, model} = require('mongoose');

const UserTestSchema = new Schema({
    FIOGroup: {type: String, required: true},
    testType: {type: String, required: false},
    answersCustom: {type: Object, required: false, default: []},
    answer: {type: Object, required: false},
    testId: {type: String, required: true},
    convertId: {type: String, required: false},
    createDate: {type: String, required: false},
})

module.exports = model('UserTest', UserTestSchema);
