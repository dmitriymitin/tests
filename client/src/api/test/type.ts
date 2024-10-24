import {testStatusType} from '../../type/test/type';
import {IQuestion} from '../question/type';
import {IFullTest} from './index';

export type EditorDescriptionTest = {time: number; blocks: ({id: string; type: string; data: {text: string; level: number}} | {id: string; type: string; data: {text: string; level?: undefined}})[]}

export interface ITestModelRequest {
    title: string;
    quantityQuestion: number;
    createDate: string;
    setting?: any;
}

export interface ITestUpdateStatusModelRequest {
    id: string;
    status: testStatusType;
}

export interface ICustomTestQuestion {
    _id: string | null;
    description: string;
    answers: {
        [key: string]: TypeCustomTestQuestionAnswer;
    } | null;
}

export interface IStudent {
    _id: string;
    FIOGroup: string;
    answer: Record<string, string>;
    countCorrectAnswers: number;
    testId: string;
}

export interface IFolderModel {
    _id: string;
    name: string;
}

export enum ETypeTest {
    SIMPLE = 'common',
    WITH_DESCRIPTION = 'description',
    WITH_QUESTIONS = 'questions',
}

export interface ITestModelResponse {
    firstQuestionTitle: string | null;
    _id: string;
    title: string;
    questionsId?: string[];
    testType?: ETypeTest;
    descriptionEditor?: EditorDescriptionTest;
    quantityQuestion: number;
    questions: IQuestion[] | null;
    status: testStatusType;
    createDate: string;
    testKey: string | null;
    updateDate?: string;
    folderId?: string;
    setting: {
        isPublicTestAnswers?: boolean;
    };
}

export type TypeCustomTestQuestionAnswer = {
    name: string;
    value: string;
}

export interface ITestCustomModelResponse {
    firstQuestionTitle: string | null;
    _id: string;
    title: string;
    questionsId?: string[];
    testType?: ETypeTest;
    questions: IQuestion[];
    status: testStatusType;
    createDate: string;
    testKey: string | null;
    updateDate?: string;
    setting?: ICustomTestSetting;
    folderId?: string;
}

export interface ICustomTestSetting {
    isRandomQuestions: boolean;
    timeForAnswer: string;
    isPublicTest: boolean;
    isPublicTestAnswers: boolean;
    isPublicTestVariants: boolean;
    isPublicTestVariantsAnswers: boolean;
}

export interface ITestCustomModelUpdateResponse {
    questionsId?: string[];
    status?: testStatusType;
    testKey?: string | null;
    createDate?: string;
    updateDate?: string;
    folderId?: string;
    setting?: ICustomTestSetting;
}

export interface IGetTestInfoCustomModelResponse {
    test: {
        _id: string;
        title: string;
        questions: IQuestion[];
        setting?: ICustomTestSetting;
        questionsId: string[];
        status: testStatusType;
        testKey: string | null;
    };
    usersInfo: IUserInfoForTest[];
    testKey: string | null;
}

export interface IGetOneTestInfoResponse {
    test: IFullTest;
    usersInfo: IUserInfoForTest[];
    testKey: string | null;
}

export interface ISaveNewTestRequest {
    FIOGroup: string;
    testType?: ETypeTest;
    answer?: {
        [key: string]: string;
    };
    answersCustom?: { questionsIdRanges: string[]; values: {
            [key: string]: {
                keys: string[];
            };
        }; };
    testId: string;
}

export interface IUserInfoForTest {
    _id: string;
    convertId?: string;
    countCorrectAnswers: number;
    FIOGroup: string;
    testType?: ETypeTest;
    answer?: {
        [key: string]: string;
    };
    answersCustom?: { questionsIdRanges: string[]; values: {
            [key: string]: {
                keys: string[];
            };
        }; };
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
    [key: TFilterById | string]: string;
} = {
  byCreationDateDescending: 'По дате создания (сначала новые)',
  byCreationDateAscending: 'По дате создания (сначала старые)',
  byDateOfChangeDescending: 'По дате редактирования (сначала новые)',
  byDateOfChangeAscending: 'По дате редакитрования (сначала старые)',
};

export enum EFilterStudentById {
    byWords,
    byDoneDescending,
    byDoneAscending,
}

export type TStudentFilterId = keyof typeof EFilterStudentById

export const EFilterStudentsTranslate: {
    [key: TStudentFilterId | string]: string;
} = {
  byWords: 'По алфавиту',
  byDoneDescending: 'По дате прохождения (сначала новые)',
  byDoneAscending: 'По дате прохождения (сначала старые)'
};

