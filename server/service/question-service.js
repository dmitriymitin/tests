const QuestionModel = require('../models/question-model')
const QuestionDto = require("../dtos/question-dto");

const getQuestionsModelDTO = (questions) => {
    return questions.map(el => {
        const questionDto = new QuestionDto(el)
        return {
            ...questionDto
        }
    })
}

class QuestionService {
    async create(data){
        const questionModel = await QuestionModel.create(data);
        return questionModel;
    }

    async getAll(){
        const questionsModel = await QuestionModel.find();
        return getQuestionsModelDTO(questionsModel);
    }
}
module.exports = new QuestionService();
