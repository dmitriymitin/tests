import {QueryKey, useQuery, useQueryClient} from "react-query";
import {getAdminAllTests} from "../../api/test";

export const useAllTest = (filterById = '2', folderId?: string) => {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ['allTests', {filterById, folderId}]
  const results = useQuery(queryKey, () => getAdminAllTests(filterById, folderId), {
    refetchOnWindowFocus: false
  });

  return {
    invalidate: () => queryClient.invalidateQueries({ queryKey: ['allTests'] }),
    ...results
  };
};
