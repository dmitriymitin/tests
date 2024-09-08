import {QueryKey, useQuery, useQueryClient} from 'react-query';
import {getAllQuestion} from '../../api/question';

export const useAllQuestion = () => {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ['allQuestion'];
  const results = useQuery(queryKey, () => getAllQuestion(), {
    refetchOnWindowFocus: false
  });

  const invalidate = () => queryClient.invalidateQueries({queryKey: ['allQuestion']});

  return {
    invalidate,
    ...results
  };
};
