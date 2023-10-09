const {Schema, model} = require('mongoose');

const ExelFileSchema = new Schema({
    file: {type: String, required: false},
    testId: {type: String, required: false}
})

module.exports = model('ExelFile', ExelFileSchema);
