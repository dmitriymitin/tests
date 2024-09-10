const QuestionModel = require('../models/question-model')
const QuestionGroupModel = require('../models/question-group-model')
const QuestionDto = require("../dtos/question-dto");
const TestCustomModel = require("../models/test-custom-model");
const {ObjectId} = require("mongodb");
const TestModel = require("../models/test-model");
const TestUserModel = require("../models/test-user-model");

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
            const questionGroup = await QuestionGroupModel.findById(id);
            if (action === 'add') questionGroup.count += 1;
            if (action === 'remove') questionGroup.count -= 1;
            await questionGroup.save();
        }
    }
}

class QuestionService {
    async create(data){
        const questionModel = await QuestionModel.create(data);
        await changeCountInGroupsId(data?.groupsId, 'add');
        return questionModel;
    }

    async deleteOne(id) {
        const questionId = new ObjectId(id);
        const question = await QuestionModel.findOne({_id: questionId});
        await changeCountInGroupsId(question.groupsId, 'remove')
        await QuestionModel.deleteOne({_id: questionId});
    }

    async getAll(){
        const questionsModel = await QuestionModel.find();
        return getQuestionsModelDTO(questionsModel);
    }
}
module.exports = new QuestionService();
