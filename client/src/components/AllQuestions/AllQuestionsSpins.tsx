import React from 'react';
import IsVisible from '../ui/isVisibleWrapper';
import {Spin} from 'antd';

interface IAllQuestionsSpinsProps {
  isLoading?: boolean;
}

const AllQuestionsSpins = ({isLoading}: IAllQuestionsSpinsProps) => {
  return (
    <IsVisible isVisible={isLoading}>
      <div className="status-block h220p">
        <Spin size={'large'}/>
      </div>
    </IsVisible>
  );
};

export default AllQuestionsSpins;
