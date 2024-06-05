import {QueryKey, useQuery, useQueryClient} from "react-query";
import {getAdminAllTests} from "../../api/test";
import {TCurrentAction, useSelectTestsStore} from "../../store/folders/useSelectTestsStore";
import {testStatusType} from "../../type/test/type";
import {useEffect} from "react";

export const useAllTest = (filterById = '2', folderId?: string, currentStatus?: testStatusType) => {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ['allTests', {filterById, folderId, currentStatus}];
  const results = useQuery(queryKey, () => getAdminAllTests(filterById, folderId, currentStatus), {
    refetchOnWindowFocus: false
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['allTests'] });

  return {
    invalidate,
    ...results
  };
};
