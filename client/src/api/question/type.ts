import {EditorDescriptionTest} from '../test/type';
import {TAnswerType} from '../../models/question';

export type IQuestionAnswer = {
  [key in TAnswerType]: {
    keys?: string[];
    values?: {
      [key: string]: {
        title: string;
        rang: number;
        key: string;
      };
    };
  };
};

export interface IQuestion {
  _id: string;
  answers: IQuestionAnswer;
  answerType: TAnswerType;
  descriptionEditor?: EditorDescriptionTest;
  groupsId?: string[];
  setting: {
    isRandomAnswers?: boolean;
    timeForAnswer?: string;
    isPublicQuestion?: boolean;
    isPublicAnswer?: boolean;
  };
}
