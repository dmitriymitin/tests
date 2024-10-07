import React, {useState} from 'react';
import IsVisible from '../../../ui/isVisibleWrapper';

interface IAnswerShowBlock {
  answer: string;
}

const AnswerShowBlock = ({answer}: IAnswerShowBlock) => {
  const [isShowAnswer, setIsShowAnswer] = useState(false);
  return (
    <div className="flex-col gap-10 h40p flex-start">
      <button
        style={{width: 'max-content'}}
        className="clearButton blue fs-16"
        onClick={() => setIsShowAnswer(prev => !prev)}>
        Показать ответ
      </button>
      <IsVisible isVisible={isShowAnswer}>
        <div className="fs-16"> Ответ: {answer} </div>
      </IsVisible>
    </div>
  );
};

export default AnswerShowBlock;
