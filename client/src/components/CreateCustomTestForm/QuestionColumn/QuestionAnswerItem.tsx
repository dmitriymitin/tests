import s from './QuestionColumn.module.scss';
import {Draggable} from 'react-beautiful-dnd';
import React from 'react';
import {IQuestion} from '../../../api/question/type';
import InfoQuestionForm from '../../InfoQuestionForm/InfoQuestionForm';
import {AnswerType} from '../../../models/question';

interface ItemProps {
  question: IQuestion;
  index: number;
  onAdd?: (question?: IQuestion) => void;
  isInfo?: boolean;
  isAllList?: boolean;
  isTitle?: boolean;
  isDisableAddQuestion?: boolean;
  isHiddenAddQuestion?: boolean;
}

const QuestionAnswerItem: React.FC<ItemProps> = ({question, isAllList, isDisableAddQuestion, isHiddenAddQuestion, isTitle = true, isInfo, index, onAdd}) => {
  if (isInfo) {
    return (
      <div className={s.columnItem}>
        <InfoQuestionForm questionData={question} isQuestionTitle={isTitle}/>
      </div>
    );
  }

  if (isAllList) {
    return (
      <div className={s.columnItem}>
        <InfoQuestionForm questionData={question} isQuestionTitle={isTitle} onAdd={() => onAdd(question)}/>
      </div>
    );
  }

  return (
    <Draggable draggableId={question?._id} index={index}>
      {provided => (
        <div
          className={s.columnItem}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <InfoQuestionForm
                isDisableAddQuestion={isDisableAddQuestion}
                questionData={question}
                onAdd={isHiddenAddQuestion ? undefined : () => onAdd(question)}
                isQuestionTitle/>
        </div>
      )}
    </Draggable>
  );
};

export default QuestionAnswerItem;
