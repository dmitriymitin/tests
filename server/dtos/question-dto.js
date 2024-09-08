module.exports = class QuestionDto {
    _id;
    answers;
    answerType;
    descriptionEditor;
    setting;
    groupId;

    constructor(model) {
        const newAnswers = Object.entries(model?.answers).reduce((acc, el) => {
            acc[el[0]] = el[1]?.values || {};
            return acc;
        }, {})
        this._id = model._id
        this.answers = newAnswers
        this.answerType = model.answerType
        this.descriptionEditor = model.descriptionEditor
        this.setting = model.setting
        this.groupId = model.groupId;
    }
}