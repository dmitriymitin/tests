import {QueryKey, useQuery, useQueryClient} from "react-query";
import {getAdminAllTests, getAllFolder} from "../../api/test";

export const useAllFolder = () => {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ['allFolder']
  const results = useQuery(queryKey, () => getAllFolder(), {
    refetchOnWindowFocus: false
  });

  return {
    invalidate: () => queryClient.invalidateQueries({ queryKey }),
    ...results
  };
};
