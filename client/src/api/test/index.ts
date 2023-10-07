import {
    ICustomTestQuestion,
    IGetOneTestInfoResponse, IGetTestInfoCustomModelResponse,
    ISaveNewTestRequest,
    ISaveNewTestResponse, ITestCustomModelRequest, ITestCustomModelResponse,
    ITestModelRequest,
    ITestModelResponse,
    ITestUpdateStatusModelRequest, TypeCustomTestQuestionAnswer
} from "./type";
import $api from "../../http";

export const getOneTest = async (id: string): Promise<ITestModelResponse> => {
    const {data} = await $api.get(`/test/getOne/${id}`);
    return data;
};

export const getOneCustomTest = async (id: string): Promise<IGetTestInfoCustomModelResponse> => {
    const {data} = await $api.get(`/test/getOneInfo/custom/${id}`);
    return data;
};

export const addQuestionToCustomTest = async (values: {
    id: string,
    question: ITestCustomModelRequest
}): Promise<ITestCustomModelResponse> => {
    const {data} = await $api.post(`/test/custom/addQuestion/${values.id}`, {
        ...values.question
    });
    return data;
};

export const getOneUserTest = async (id: string): Promise<ITestModelResponse> => {
    const {data} = await $api.get(`/test/user/getOne/${id}`);
    return data;
};

export const getOneTestInfo = async (id: string): Promise<IGetOneTestInfoResponse> => {
    const {data} = await $api.get(`/test/getOneInfo/${id}`);
    return data;
};

export const createNewTest = async (values: ITestModelRequest): Promise<ITestModelResponse> => {
    const {data} = await $api.post('/test/create', { ...values, status: 'Start'});
    return data;
};

export const onDeleteQuestionCustomTest = async (values: {
    id: string | null, testId: string | null
}): Promise<any> => {
    const {data} = await $api.delete(`/test/custom/deleteOneQuestion?id=${values.id}&testId=${values.testId}`);
    return data;
};

export const onUpdateCustomTestTitle = async (values: {
    testId: string | null
    title: string;
}): Promise<any> => {
    const {data} = await $api.post(`/test/custom/updateTitle?id=${values.testId}`, {
        title: values.title,
    });
    return data;
};

export const onUpdateQuestionCustomTest = async (values: {
    id: string | null,
    testId: string | null
    question: Omit<ICustomTestQuestion, '_id'>
}): Promise<any> => {
    const {data} = await $api.post(`/test/custom/updateOneQuestion?id=${values.id}&testId=${values.testId}`, {
        description: values.question.description,
        answers: values.question.answers
    });
    return data;
};

export const createNewCustomTest = async (): Promise<ITestCustomModelResponse> => {
    const {data} = await $api.post('/test/createCustom');
    return data;
};

export const saveNewTest = async (values: ISaveNewTestRequest): Promise<ISaveNewTestResponse> => {
    const {data} = await $api.post('/test/saveAnswer', { ...values, status: 'Start'});
    return data;
};

export const getAdminAllTests = async (): Promise<(ITestModelResponse & ITestCustomModelResponse)[]> => {
    const {data} = await $api.get('/test/all');
    return data;
};

export const getUsersAllTests = async (): Promise<ITestModelResponse[]> => {
    const {data} = await $api.get('/test/users/all');
    return data;
};

export const getCustomTestQuestion = async (id: string): Promise<ICustomTestQuestion> => {
    const {data} = await $api.get(`/test/custom/getOneQuestionCustomInfo/${id}`);
    return data;
};

export const clearTestResults = async (id: string): Promise<any> => {
    const {data} = await $api.delete(`/test/clearResults/${id}`);
    return data;
};

export const updateTitleFirstQuestion = async (title: string): Promise<any> => {
    const {data} = await $api.post(`/test/updateFirstQuestion`, {
        title
    });
    return data;
};

export const deleteTest = async (id: string): Promise<any> => {
    const {data} = await $api.delete(`/test/deleteOne/${id}`);
    return data;
};

export const updateAdminStatusTest = async (values: ITestUpdateStatusModelRequest): Promise<ITestModelResponse[]> => {
    let newStatus = values.status
    switch (values.status) {
        case 'Start':
            newStatus = 'Open'
            break;
        case 'Open':
            newStatus = 'Close'
            break
        case 'Close':
            newStatus = 'Open'
            break
    }
    const {data} = await $api.post('/test/changeStatusOne', { ...values, status: newStatus});
    return data;
};

export const updateAdminKeyTest = async (values: {
    id: string,
    key: string
}): Promise<ITestModelResponse> => {
    const {data} = await $api.post('/test/changeKeyOne', { ...values});
    return data;
};
