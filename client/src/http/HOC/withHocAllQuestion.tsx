import React, {useEffect} from 'react';
import IsVisible from '../../components/ui/isVisibleWrapper';
import {useAllQuestion} from '../hooks/useAllQuestion';
import {useAllGroupsStore} from '../../store/groups/useAllGroups';

const withHocAllQuestion = WrappedComponent => props => {
  const {setCurrentActiveGroupIds} = useAllGroupsStore(store => store);

  useEffect(() => {
    setCurrentActiveGroupIds([]);
  }, []);

  const {data: questionData, isLoading, isFetching} = useAllQuestion();
  return (
    <WrappedComponent
      questionData={questionData}
      isAllQuestionsLoading={isLoading || isFetching}
      {...props} />
  );
};

export default withHocAllQuestion;
