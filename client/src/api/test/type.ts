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

export type TypeCustomTestQuestionAnswer = {
    name: string,
    value: string
}

export interface ICustomTestQuestion {
    _id: string | null;
    description: string;
    answers: {
        [key: string]: TypeCustomTestQuestionAnswer
    } | null
}

export interface ITestCustomModelResponse {
    _id: string;
    title: string;
    questions: ICustomTestQuestion[];
    status: testStatusType;
    testKey: string | null;
}

export interface IGetTestInfoCustomModelResponse {
    test: {
        _id: string;
        title: string;
        questions: ICustomTestQuestion[];
        status: testStatusType;
        testKey: string | null;
    },
    usersInfo: ISaveNewTestResponse[],
    testKey: string | null;
}

export interface ITestCustomModelRequest {
    description: string;
    answers: {
        [key: string]: TypeCustomTestQuestionAnswer
    }
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

