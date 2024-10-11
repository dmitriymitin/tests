import React from 'react';
import s from './CreateCustomTestForm.module.scss';
import {DragDropContext} from 'react-beautiful-dnd';
import QuestionColumn from './QuestionColumn/QuestionColumn';
import AllQuestionColumn from './QuestionColumn/AllQuestionColumn';
import {useDragEnd} from './hooks/useDragEnd';
import {useQuestionsEvent} from './hooks/useQuestionsEvent';
import {IGetTestInfoCustomModelResponse} from '../../api/test/type';
import {IQuestion} from '../../api/question/type';

interface ICreateCustomTestFormAllQuestions {
  testData: IGetTestInfoCustomModelResponse;
  questionData: IQuestion[];
  isTestLoading?: boolean;
  isAllQuestionsLoading?: boolean;
}

const CreateCustomTestFormAllQuestions = ({
  testData,
  questionData,
  isTestLoading,
  isAllQuestionsLoading
}: ICreateCustomTestFormAllQuestions) => {
  const {
    columns,
    setColumns,
    onDragEnd
  } = useDragEnd({
    testData,
    questionData
  });

  const {
    onAddQuestion,
    onDeleteQuestionDrag,
    onAllQuestionTrigger,
    onClickId,
    onShowResult,
    deleteCustomTestLoading,
    addQuestionToCustomTestLoading
  } = useQuestionsEvent({setColumns});

  return (
    <div className={s.questions_block}>
      <DragDropContext onDragEnd={onDragEnd}>
        <QuestionColumn
          onResult={onShowResult}
          onClick={onClickId}
          isShowResult={columns['all_questions'].isShowResult}
          currentList={columns['all_questions'].currentList}
          col={columns['test_questions']}
          key={columns['test_questions'].id}
          onDelete={onDeleteQuestionDrag}
          isLoading={addQuestionToCustomTestLoading || deleteCustomTestLoading || isTestLoading}
        />
      </DragDropContext>
      <DragDropContext onDragEnd={onDragEnd}>
        <AllQuestionColumn
          isAllQuestionsLoading={isAllQuestionsLoading}
          dataQuestion={columns['all_questions']?.questionsDataShowResult}
          isLoadingAddQuestion={addQuestionToCustomTestLoading}
          col={columns['all_questions']}
          listTestQuestions={columns['test_questions']}
          key={columns['all_questions'].id}
          onAdd={onAddQuestion}
          onAllQuestions={onAllQuestionTrigger}
        />
      </DragDropContext>
    </div>
  );
};

export default CreateCustomTestFormAllQuestions;
