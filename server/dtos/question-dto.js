module.exports = class QuestionDto {
    _id;
    convertId;
    answers;
    answerType;
    descriptionEditor;
    setting;
    groupsId;

    constructor(model) {
        const newAnswers = Object.entries(model?.answers).reduce((acc, el) => {
            acc[el[0]] = el[1]?.values || {};
            return acc;
        }, {})
        this._id = model._id
        this.answers = newAnswers
        this.answerType = model.answerType
        this.convertId = model.convertId
        this.descriptionEditor = model.descriptionEditor
        this.setting = model.setting
        this.groupsId = model.groupsId;
    }
}