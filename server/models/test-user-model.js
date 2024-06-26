const {Schema, model} = require('mongoose');

const UserTestSchema = new Schema({
    FIOGroup: {type: String, required: true},
    answer: {type: Object, required: true},
    testId: {type: String, required: true},
    createDate: {type: String, required: false},
})

module.exports = model('UserTest', UserTestSchema);
