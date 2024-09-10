import {QueryKey, useQuery, useQueryClient} from 'react-query';
import {getAllQuestion} from '../../api/question';
import {getAllGroupQuestion} from '../../api/questionGroup';

export const useAllGroupQuestion = (isFetching = true) => {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ['allGroupQuestion'];
  const results = useQuery(queryKey, () => getAllGroupQuestion(), {
    enabled: isFetching,
    refetchOnWindowFocus: false
  });

  const invalidate = () => queryClient.invalidateQueries({queryKey: ['allGroupQuestion']});

  return {
    invalidate,
    ...results
  };
};
