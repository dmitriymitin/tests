import React, {useMemo, useState} from 'react';
import {IQuestion, TQuestionAnswerKeyValues} from '../../api/question/type';
import s from './InfoQuestionForm.module.scss';
import clsx from 'clsx';
import parse from 'html-react-parser';
import edjsHTML from 'editorjs-html';
import AnswerQuestionParse from './components/AnswerQuestionParse/AnswerQuestionParse';
import IsVisible from '../ui/isVisibleWrapper';
import {Button} from 'antd';
import AnswerShowBlock from './components/AnswerShowBlock/AnswerShowBlock';
import {AnswerType} from '../../models/question';
import {shuffleArray} from '../../utils/helpers';
import AnswerStatusText from './components/AnswerStatusText';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';

const edjsParser = edjsHTML();

const getAnswer = (questionData?: IQuestion, randomAnswers?: string[]) => {
  if (questionData.answerType === AnswerType.Text) {
    return questionData?.answers?.text?.keys[0];
  }

  let val: string = AnswerType.Radio;
  if (questionData.answerType === AnswerType.Checkbox) {
    val = AnswerType.Checkbox;
  }

  const answersData = questionData?.answers?.[val] as TQuestionAnswerKeyValues;
  const arrayValues = Object.values(answersData?.values);

  const answerArray = answersData?.keys.map(el => {
    const randomIndex = randomAnswers?.findIndex(randomEl => randomEl === answersData?.values[el].keyId);
    return {
      key: arrayValues?.[randomIndex]?.key,
      rang: arrayValues?.[randomIndex]?.rang
    };
  });
  const answerArraySort = answerArray.sort((a, b) => a.rang - b.rang);
  return answerArraySort.reduce((acc, el) => acc += el.key, '');
};

export const getRandomAnswers = (questionData?: IQuestion, isRandomAnswers?: boolean): string[] => {
  let val: 'radio' | 'checkbox' = AnswerType.Radio;
  if (questionData.answerType === AnswerType.Checkbox) {
    val = AnswerType.Checkbox;
  }

  const answersData = questionData?.answers?.[val];
  const arrayIds = Object.keys(answersData?.values);
  if (!isRandomAnswers) {
    return arrayIds;
  }

  return shuffleArray(arrayIds);
};

interface IInfoQuestionFormProps {
  questionData: IQuestion;
  isPublicAnswer?: boolean;
  onSubmit: () => void;
}

const InfoQuestionForm = ({questionData, onSubmit, ...props}: IInfoQuestionFormProps) => {
  const formInstance = useFormInstance();
  const [lastValue, setLastValue] = useState('');
  const [statusAnswer, setStatusAnswer] = useState<'error' | 'warning'>();

  const isPublicAnswer = props.isPublicAnswer && questionData?.setting.isPublicAnswer;
  const isText = questionData?.answerType === AnswerType.Text;
  const randomAnswers = useMemo(() =>
    questionData?.answerType !== AnswerType.Text ? getRandomAnswers(questionData, questionData?.setting?.isRandomAnswers) : undefined
  , [questionData]);
  const rightAnswer = isPublicAnswer ? getAnswer(questionData, randomAnswers) : '';

  return (
    <div className={s.question}>
      <div
        className={clsx('text-container', s.descriptionBg)}>{parse(edjsParser.parse(questionData.descriptionEditor).join(''))}</div>
      <div className={clsx('gap-10', {
        ['flex-row']: isText,
        ['flex-col']: !isText
      })}>
        <div className={clsx(
          {['testBackground flex-col gap-10']: !isText},
          {['flex-row gap-10 width100']: isText}
        )}>
          <AnswerQuestionParse
            lastValue={lastValue}
            questionId={questionData._id}
            statusAnswer={statusAnswer}
            answers={questionData?.answers}
            answerType={questionData.answerType}
            shuffleArraysIds={randomAnswers}
          />
          <IsVisible isVisible={isPublicAnswer}>
            <div className="flex-row flex-end flex-middle gap-10">
              {!isText && questionData?.answerType !== AnswerType.Checkbox && <AnswerStatusText status={statusAnswer}/>}
              <Button
                style={{maxWidth: 200}}
                onClick={() => {
                  const lastValueIfi = (() => {
                    const getValue = formInstance.getFieldValue('answerFieldsData/' + questionData?._id);
                    if (questionData?.answerType !== AnswerType.Checkbox) {
                      return getValue?.[questionData?.answerType].keys?.[0];
                    }

                    return getValue?.checkbox.keys;
                  })();
                  setLastValue(lastValueIfi);
                  const isRight = (() => {
                    if (questionData?.answerType === AnswerType.Text) {
                      return rightAnswer === lastValueIfi;
                    }

                    if (questionData?.answerType === AnswerType.Radio) {
                      return questionData?.answers?.radio?.keys.includes(lastValueIfi);
                    }

                    return undefined;
                  })();
                  setStatusAnswer(isRight ? 'warning' : 'error');
                  onSubmit();
                }}
              >
                Проверить ответ
              </Button>
            </div>
          </IsVisible>
        </div>
      </div>
      <IsVisible isVisible={isPublicAnswer}>
        <AnswerShowBlock answer={rightAnswer}/>
      </IsVisible>
    </div>
  );
};

export default InfoQuestionForm;
