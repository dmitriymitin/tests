import {
    IGetOneTestInfoResponse,
    ISaveNewTestRequest,
    ISaveNewTestResponse,
    ITestModelRequest,
    ITestModelResponse,
    ITestUpdateStatusModelRequest
} from "./type";
import $api from "../../http";

export const getOneTest = async (id: string): Promise<ITestModelResponse> => {
    const {data} = await $api.get(`/test/getOne/${id}`);
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

export const saveNewTest = async (values: ISaveNewTestRequest): Promise<ISaveNewTestResponse> => {
    const {data} = await $api.post('/test/saveAnswer', { ...values, status: 'Start'});
    return data;
};

export const getAdminAllTests = async (): Promise<ITestModelResponse[]> => {
    const {data} = await $api.get('/test/all');
    return data;
};

export const getUsersAllTests = async (): Promise<ITestModelResponse[]> => {
    const {data} = await $api.get('/test/users/all');
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
