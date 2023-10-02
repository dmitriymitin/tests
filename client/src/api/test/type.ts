import {testStatusType} from "../../type/test/type";

export interface ITestModelRequest {
    title: string;
    quantityQuestion: number;
}

export interface ITestUpdateStatusModelRequest {
    id: string;
    status: testStatusType
}

export interface ITestModelResponse {
    _id: string,
    title: string;
    quantityQuestion: number;
    status: testStatusType;
    testKey: string | null;
}

export interface IGetOneTestInfoResponse {
    test: ITestModelResponse,
    usersInfo: ISaveNewTestResponse[]
    testKey: string | null;
}

export interface ISaveNewTestRequest {
    FIOGroup: string,
    answer: {
        [key: string]: string;
    };
    testId: string;
}

export interface ISaveNewTestResponse {
    _id: string;
    FIOGroup: string;
    answer: {
        [key: string]: string;
    };
    testId: string;
}

