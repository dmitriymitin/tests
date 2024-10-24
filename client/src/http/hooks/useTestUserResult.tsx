import {QueryKey, useQuery, useQueryClient} from 'react-query';
import {getAdminAllTests, getUserResultInTest} from '../../api/test';

export const useTestUserResult = (id: string) => {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ['testResultUserInfo', id];
  const results = useQuery(queryKey, () => getUserResultInTest(id), {
    refetchOnWindowFocus: false,
    retry: 1
  });

  const invalidate = () => queryClient.invalidateQueries({queryKey: ['testResultUserInfo']});

  return {
    invalidate,
    ...results
  };
};
