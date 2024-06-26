import {testStatusType} from "../../type/test/type";

export type EditorDescriptionTest = {time: number, blocks: ({id: string, type: string, data: {text: string, level: number}} | {id: string, type: string, data: {text: string, level?: undefined}})[]}

export interface ITestModelRequest {
    title: string;
    quantityQuestion: number;
    createDate: string;
}

export interface ITestUpdateStatusModelRequest {
    id: string;
    status: testStatusType
}

export interface ICustomTestQuestion {
    _id: string | null;
    description: string;
    answers: {
        [key: string]: TypeCustomTestQuestionAnswer
    } | null
}


export interface IStudent {
    _id: string,
    FIOGroup: string,
    answer: Record<string, string>,
    testId: string,
}

export interface IFolderModel {
    _id: string,
    name: string
}

export interface ITestModelResponse {
    firstQuestionTitle: string | null;
    _id: string,
    title: string;
    descriptionEditor?: EditorDescriptionTest;
    quantityQuestion: number;
    questions: ICustomTestQuestion[] | null
    status: testStatusType;
    createDate: string;
    testKey: string | null;
    updateDate?: string;
    folderId?: string;
}

export type TypeCustomTestQuestionAnswer = {
    name: string,
    value: string
}

export interface ITestCustomModelResponse {
    firstQuestionTitle: string | null,
    _id: string;
    title: string;
    questions: ICustomTestQuestion[];
    status: testStatusType;
    createDate: string;
    testKey: string | null;
    updateDate?: string;
    folderId?: string;
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
    test: ITestModelResponse & ITestCustomModelResponse,
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


export type TFilterById = 'byCreationDateDescending' | 'byCreationDateAscending' | 'byDateOfChangeDescending' | 'byDateOfChangeAscending'

export enum EFilterById {
    byCreationDateDescending = '0',
    byCreationDateAscending = '1',
    byDateOfChangeDescending = '2',
    byDateOfChangeAscending = '3'
}

export const EFilterTranslate: {
    [key: TFilterById | string]: string
} = {
    byCreationDateDescending: 'По дате создания (сначала новые)',
    byCreationDateAscending: 'По дате создания (сначала старые)',
    byDateOfChangeDescending: 'По дате редактирования (сначала новые)',
    byDateOfChangeAscending: 'По дате редакитрования (сначала старые)',
}

export enum EFilterStudentById {
    byWords,
    byDoneDescending,
    byDoneAscending,
}

export type TStudentFilterId = keyof typeof EFilterStudentById

export const EFilterStudentsTranslate: {
    [key: TStudentFilterId | string]: string
} = {
    byWords: 'По алфавиту',
    byDoneDescending: 'По дате прохождения (сначала новые)',
    byDoneAscending: 'По дате прохождения (сначала старые)'
}

