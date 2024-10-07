const QuestionModel = require('../models/question-model')
const QuestionGroupModel = require('../models/question-group-model')
const QuestionDto = require("../dtos/question-dto");
const TestCustomModel = require("../models/test-custom-model");
const {ObjectId} = require("mongodb");
const TestModel = require("../models/test-model");
const TestUserModel = require("../models/test-user-model");
const convertIdToCustomFormat = require("../helpers/util");

const getQuestionsModelDTO = (questions) => {
    return questions.map(el => {
        const questionDto = new QuestionDto(el)
        return {
            ...questionDto
        }
    })
}

const changeCountInGroupsId = async (groupsId, action) => {
    if (groupsId?.length) {
        for (const id of groupsId) {
            const groupId = new ObjectId(id);
            const questionGroup = await QuestionGroupModel.findOne({_id: groupId});
            if (action === 'add') questionGroup.count += 1;
            if (action === 'remove') questionGroup.count -= 1;
            await questionGroup.save();
        }
    }
}

class QuestionService {
    async create(data){
        const questionModel = await QuestionModel.create(data);
        const questionModelFind = await QuestionModel.findOne({_id: questionModel._id});
        questionModelFind.convertId = convertIdToCustomFormat(questionModel.id);
        await questionModelFind.save();
        await changeCountInGroupsId(data?.groupsId, 'add');
        return questionModelFind;
    }

    async update(params){
        const id = params.id;
        const data = params.data;
        const {_id, _doc: {_id: _id1, ...questionOldData}} = await QuestionModel.findById(id);
        const newData = {...questionOldData, ...data};
        const question = await QuestionModel.updateOne({_id: id}, newData);
        await changeCountInGroupsId(questionOldData.groupsId, 'remove');
        await changeCountInGroupsId(data.groupsId, 'add');
        return question;
    }

    async deleteOne(id) {
        const questionId = new ObjectId(id);
        const question = await QuestionModel.findOne({_id: questionId});
        await changeCountInGroupsId(question.groupsId, 'remove')
        await QuestionModel.deleteOne({_id: questionId});
    }

    async getOne(id) {
        const questionId = new ObjectId(id);
        const question = await QuestionModel.findOne({_id: questionId});
        // const questionDto = new QuestionDto(question)
        const questionDto = question
        return questionDto
    }

    async getAll({activeGroupIds}){
        let questionsModel = [];
        if (activeGroupIds && activeGroupIds?.length) {
            questionsModel = await QuestionModel.find({groupsId: {$in: activeGroupIds}});
        } else {
            questionsModel = await QuestionModel.find();
        }
        return getQuestionsModelDTO(questionsModel);
    }
}
module.exports = new QuestionService();
