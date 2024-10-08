import React from 'react';
import clsx from 'clsx';

interface IAnswerStatusTextProps {
  status: 'error' | 'warning';
}

const AnswerStatusText = ({status}: IAnswerStatusTextProps) => {
  return (
    <div className={
      clsx({
        ['red']: status === 'error',
        ['green']: status === 'warning'
      })
    }>
      {status === 'error' && 'Неверно'}
      {status === 'warning' && 'Верно'}
    </div>
  );
};

export default AnswerStatusText;
