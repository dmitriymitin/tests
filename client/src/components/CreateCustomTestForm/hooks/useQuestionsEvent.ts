import {IQuestion} from '../../../api/question/type';
import {message} from 'antd';
import {useMutation} from 'react-query';
import {addQuestionToCustomTest, onDeleteQuestionCustomTest} from '../../../api/test';
import {useParams} from 'react-router-dom';
import {TQuestionColumn} from '../QuestionColumn/QuestionColumn';
import React from 'react';
import questions from '../../../pages/Questions';

export const useQuestionsEvent = ({setColumns}: {setColumns: React.Dispatch<React.SetStateAction<{[p: string]: TQuestionColumn}>>}) => {
  const {testId} = useParams();

  const {
    mutateAsync: addQuestionToCustomTestTrigger,
    isLoading: addQuestionToCustomTestLoading
  } = useMutation(addQuestionToCustomTest);

  const {
    mutateAsync: deleteQuestionCustomTEstTrigger,
    isLoading: deleteCustomTestLoading
  } = useMutation(onDeleteQuestionCustomTest);

  const onAddQuestion = async (question: IQuestion) => {
    try {
      const res = await addQuestionToCustomTestTrigger({
        id: testId,
        questionId: question?._id
      });
      const questData = res?.questions;
      setColumns(prev => {
        return {
          test_questions: {
            ...prev['test_questions'],
            list: [...prev['test_questions']?.list, {
              id: question._id,
              convertId: question.convertId
            }]
          },
          all_questions: {
            ...prev['all_questions'],
            isShowResult: false,
            questionsDataShowResult: questData,
            list: prev['all_questions']?.list.filter(el => el.id !== question?._id)
          },
        };
      });
    } catch (e) {
      message.error('Ошибка при добавлении вопроса');
    }
  };

  const onDeleteQuestionDrag = async (id: string) => {
    try {
      await deleteQuestionCustomTEstTrigger({
        id: testId,
        questionId: id
      });
      setColumns(prev => {
        const currentList = prev['test_questions']?.list.find(el => el.id === id);
        return {
          ...prev,
          test_questions: {
            ...prev['test_questions'],
            list: prev['test_questions']?.list.filter(el => el.id !== id),
          },
          all_questions: {
            ...prev['all_questions'],
            list: [currentList, ...prev['all_questions']?.list],
            isShowResult: false,
            currentList: undefined,
          },
        };
      });
    } catch (e) {
      message.error('Ошибка при удалении вопроса');
    }
  };

  const onAllQuestionTrigger = () => {
    setColumns(prev => {
      return {
        ...prev,
        all_questions: {
          ...prev['all_questions'],
          isShowResult: false,
          currentList: undefined,
        },
      };
    });
  };

  const onClickId = (id: string) => {
    setColumns(prev => {
      const currentList = prev['test_questions']?.list.find(el => el.id === id);
      return {
        ...prev,
        test_questions: prev['test_questions'],
        all_questions: {
          ...prev['all_questions'],
          isShowResult: false,
          currentList
        },
      };
    });
  };

  const onShowResult = () => {
    setColumns(prev => {
      return {
        ...prev,
        test_questions: prev['test_questions'],
        all_questions: {
          ...prev['all_questions'],
          currentList: undefined,
          isShowResult: true
        },
      };
    });
  };

  return {
    deleteCustomTestLoading,
    addQuestionToCustomTestLoading,
    onAddQuestion,
    onAllQuestionTrigger,
    onClickId,
    onDeleteQuestionDrag,
    onShowResult
  };
};
