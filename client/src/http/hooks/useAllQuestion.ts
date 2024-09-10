import {QueryKey, useQuery, useQueryClient} from 'react-query';
import {getAllQuestion} from '../../api/question';

export const useAllQuestion = (isFetching = true) => {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ['allQuestion'];
  const results = useQuery(queryKey, () => getAllQuestion(), {
    enabled: isFetching,
    refetchOnWindowFocus: false
  });

  const invalidate = () => queryClient.invalidateQueries({queryKey: ['allQuestion']});

  return {
    invalidate,
    ...results
  };
};
