import {QueryKey, useQuery, useQueryClient} from "react-query";
import {getAllStudentsBySearch} from "../../api/test";

interface IUseAllTestParams {
  sortId?: number,
  page?: number,
  limit?: number,
  search?: string;
  isLastParams?: boolean;
}

export const useAllStudents = ({isLastParams, ...params} : IUseAllTestParams) => {
  const queryClient = useQueryClient();

  const queryKey: QueryKey = ['students' + params.search + params.page + params.limit + params.sortId]
  const results = useQuery({
    queryKey: queryKey,
    queryFn: () => getAllStudentsBySearch({
      search: params.search || '',
      pageNumber: params.page || 0,
      limit: params.limit || 10,
      sortId: params.sortId || 0
    }),
    refetchOnWindowFocus: false
  })

  return {
    invalidate: () => queryClient.invalidateQueries({ queryKey }),
    ...results
  };
};
