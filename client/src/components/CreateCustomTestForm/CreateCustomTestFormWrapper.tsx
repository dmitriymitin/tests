import React from 'react';
import IsVisible from '../ui/isVisibleWrapper';
import {useAllQuestion} from '../../http/hooks/useAllQuestion';

const withHocCreateCustomTestForm = WrappedComponent => props => {
  const {data: questionData, isLoading, isFetching} = useAllQuestion();
  return (
    <IsVisible isVisible={!isLoading && !isFetching}>
      <WrappedComponent classNamePrefix="drop" questionData={questionData} {...props} />
    </IsVisible>
  );
};

export default withHocCreateCustomTestForm;
