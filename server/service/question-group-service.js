const QuestionGroupModel = require('../models/question-group-model')

class QuestionGroupService {
    async create(data){
        const questionGroupModel = await QuestionGroupModel.create(data);
        return questionGroupModel;
    }

    async getAll(){
        const questionsGroupModel = await QuestionGroupModel.find();
        return questionsGroupModel;
    }
}
module.exports = new QuestionGroupService();
