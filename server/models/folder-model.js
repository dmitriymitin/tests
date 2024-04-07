const {model, Schema} = require("mongoose");

const FolderSchema = new Schema({
    name: {type: String, required: false}
})

module.exports = model('FolderSchema', FolderSchema);

