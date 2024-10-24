import React, {useState} from 'react';
import IsVisible from '../../../ui/isVisibleWrapper';
import clsx from 'clsx';

interface IAnswerShowBlock {
  answer: string;
  isAnswerForVariant?: boolean;
}

const AnswerShowBlock = ({answer, isAnswerForVariant}: IAnswerShowBlock) => {
  const [isShowAnswer, setIsShowAnswer] = useState(false);
  return (
    <div className={clsx('flex-col gap-10 mt-10 flex-start', {['h40p mb-10']: !isAnswerForVariant})}>
      <IsVisible isVisible={!isAnswerForVariant}>
        <button
          style={{width: 'max-content'}}
          className="clearButton blue fs-16"
          onClick={() => setIsShowAnswer(prev => !prev)}>
          Показать ответ
        </button>
      </IsVisible>
      <IsVisible isVisible={isAnswerForVariant || isShowAnswer}>
        <div className="fs-16"> Ответ: {answer} </div>
      </IsVisible>
    </div>
  );
};

export default AnswerShowBlock;
