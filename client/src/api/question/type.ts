import {EditorDescriptionTest} from '../test/type';
import {TAnswerType} from '../../models/question';

export type TQuestionAnswerValues = {
  [key: string]: {
    title: string;
    rang: number;
    key: string;
    keyId?: string;
  };
}

export type TQuestionAnswerKeyValues = {
  keys?: string[];
  values?: TQuestionAnswerValues;
}

export type IQuestionAnswer = {
  [key in TAnswerType]: TQuestionAnswerKeyValues;
};

export interface IQuestion {
  _id: string;
  answers: IQuestionAnswer;
  answerType: TAnswerType;
  descriptionEditor?: EditorDescriptionTest;
  groupsId?: string[];
  convertId?: string;
  setting: {
    isRandomAnswers?: boolean;
    timeForAnswer?: string;
    isPublicQuestion?: boolean;
    isPublicAnswer?: boolean;
  };
}
