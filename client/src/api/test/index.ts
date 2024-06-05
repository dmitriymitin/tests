import {
    EditorDescriptionTest,
    ICustomTestQuestion, IFolderModel,
    IGetOneTestInfoResponse, IGetTestInfoCustomModelResponse,
    ISaveNewTestRequest,
    ISaveNewTestResponse, IStudent, ITestCustomModelRequest, ITestCustomModelResponse,
    ITestModelRequest,
    ITestModelResponse,
    ITestUpdateStatusModelRequest, TypeCustomTestQuestionAnswer
} from "./type";
import $api from "../../http";
import exampleData from "../../components/CreateCustomTestDescriptionForm/Editor/exampleData";
import {ITest} from "../../models/ITest";
import {TCurrentAction} from "../../store/folders/useSelectTestsStore";
import {testStatusType} from "../../type/test/type";

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

export const createNewTestWithDescription = async (values: ITestModelRequest): Promise<ITestModelResponse> => {
    const {data} = await $api.post('/test/create', { ...values, description: exampleData, status: 'Start'});
    return data;
};

export const updateTestDescriptionEditor = async (values: {
    id: string,
    description: EditorDescriptionTest
}) => {
    const {data} = await $api.post(`/test/description/updateDescription/${values.id}`, {
        description: values.description
    })
    return data;
}

export const openAllTestFetcher = async () => {
    const {data} = await $api.post(`/test/openAll`);
    return data;
}

export const closeAllTestFetcher = async () => {
    const {data} = await $api.post(`/test/closeAll`);
    return data;
}

export const clearAllTestResultsFetcher = async () => {
    const {data} = await $api.post(`/test/clearAllResults`);
    return data;
}

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

export const onUpdateTestInfo = async (values: {
    testId: string | null
    title?: string;
    quantityQuestion?: number;
    description?: EditorDescriptionTest
}): Promise<any> => {
    const {data} = await $api.post(`/test/changeInfoTest?id=${values.testId}`, {
        title: values.title,
        quantityQuestion: values.quantityQuestion,
        description: values.description
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

export const createNewCustomTest = async (createDate: string): Promise<ITestCustomModelResponse> => {
    const {data} = await $api.post('/test/createCustom', {
        createDate
    });
    return data;
};

export const saveNewTest = async (values: ISaveNewTestRequest): Promise<ISaveNewTestResponse> => {
    const {data} = await $api.post('/test/saveAnswer', { ...values, status: 'Start'});
    return data;
};

export const getAdminAllTests = async (filterByCreateId?: string, folderId?: string, status?: testStatusType | undefined): Promise<(ITestModelResponse & ITestCustomModelResponse)[]> => {
    const {data} = await $api.get('/test/all', {
        params: {
            filterByCreateId,
            folderId,
            status
        }
    });
    return data;
};

export const getAllFolder = async (): Promise<IFolderModel[]>  => {
    const {data} = await $api.get('/test/get/folder');
    return data;
}

export const createNewFolderApi = async ({folderName, testIds = []}: {
    folderName: string, testIds?: string[]
}): Promise<void> => {
    const {data} = await $api.post('/test/create/folder', {
        name: folderName,
        testIds
    });
    return data;
};

export const updateFolderApi = async ({folderName, testIds = [], folderId}: {
    folderName: string, testIds?: string[], folderId?: string;
}): Promise<void> => {
    const {data} = await $api.post('/test/update/folder', {id: folderId, name: folderName, testIds});
    return data;
};

export const putFolderOneApi = async ({id, folderId}: {
    id?: string, folderId?: string;
}): Promise<void> => {
    const {data} = await $api.post('/test/putFolderOne', {id, folderId});
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

export const deleteFolder = async (id: string): Promise<any> => {
    const {data} = await $api.delete(`/test/deleteOne/folder/${id}`);
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

export const getAllStudentsBySearch = async ({search, pageNumber, limit = 10, sortId}: { search: string, pageNumber: number, limit?: number, sortId?: number}): Promise<{
    data: {
        userInfo: IStudent,
        test: {
            title: string;
            _id: string;
            testKey?: string;
        };
    }[],
    totalCount: number
}> => {
    const {data} = await $api.get('/test/getAllStudents', {
        params: {
            search, pageNumber, limit, sortId
        }
    });

    return data;
};

export type TActionManyTest = 'clearResults' | 'delete' | 'addInFolder' | 'open' | 'close'

export const actionManyTest = async (values: {
    testIds: string[],
    action: TActionManyTest,
    folderId?: string
}): Promise<ITestModelResponse> => {
    const {data} = await $api.post('/test/many/action', { ...values});
    return data;
};
