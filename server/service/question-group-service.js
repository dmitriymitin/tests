const QuestionGroupModel = require('../models/question-group-model')
const QuestionModel = require('../models/question-model')
const {ObjectId} = require("mongodb");

class QuestionGroupService {
    async create(data){
        const questionGroupModel = await QuestionGroupModel.create(data);
        return questionGroupModel;
    }

    async update(data){
        const group  = await QuestionGroupModel.findById(data._id);
        group.name = data.name;
        await group.save();
    }

    async deleteOne(id) {
        const idGroup = new ObjectId(id);
        await QuestionGroupModel.deleteOne({_id: idGroup});
        const questions = QuestionModel.find();
        if (questions?.length) {
            for (const question of questions) {
                const groupsId = question.groupsId;
                question.groupsId = groupsId?.filter(el => el !== id)
                await question.save();
            }
        }
        return idGroup
     }

    async getAll(){
        const questionsGroupModel = await QuestionGroupModel.find();
        return questionsGroupModel;
    }
}
module.exports = new QuestionGroupService();
