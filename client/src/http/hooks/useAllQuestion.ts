import {QueryKey, useQuery, useQueryClient} from 'react-query';
import {getAllQuestion} from '../../api/question';
import {useAllGroupsStore} from "../../store/groups/useAllGroups";

interface IUseAllQuestionArgs {
  isFetching?: boolean;
  activeGroupIds?: string[];
}

export const useAllQuestion = ({isFetching = true}: IUseAllQuestionArgs = {}) => {
  const currentActiveGroups = useAllGroupsStore(store => store.currentActiveGroups);
  const activeGroupIds = currentActiveGroups?.map(el => el._id) || [];
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ['allQuestion', activeGroupIds];
  const results = useQuery(queryKey, () => getAllQuestion({
    activeGroupIds,
  }), {
    enabled: isFetching,
    refetchOnWindowFocus: false
  });

  const invalidate = () => queryClient.invalidateQueries({queryKey: ['allQuestion']});

  return {
    invalidate,
    ...results
  };
};
