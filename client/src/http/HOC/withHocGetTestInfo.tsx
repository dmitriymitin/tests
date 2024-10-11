import React from 'react';
import IsVisible from '../../components/ui/isVisibleWrapper';
import {useQuery} from 'react-query';
import {getOneCustomTest} from '../../api/test';
import {IGetTestInfoCustomModelResponse} from '../../api/test/type';

interface IWrappedComponentProps {
  testData?: IGetTestInfoCustomModelResponse;
  refetchTest?: () => void;
  isTestLoading?: boolean;
  isTestFetching?: boolean;
}

interface IWithHocGetTestInfoProps {
  testId?: string;
}

const withHocGetTestInfo =
  (params: IWithHocGetTestInfoProps) =>
    (WrappedComponent: React.ComponentType<IWrappedComponentProps>) =>
      (props: any) => {
        const {testId} = params;
        const {
          data: testData, // Renamed to match the props expected by WrappedComponent
          isLoading: customTestLoading,
          isFetching: customTestFetching,
          refetch
        } = useQuery(['customTestInfo', testId], () => getOneCustomTest(testId!), {
          refetchOnWindowFocus: false
        });

        return (
          <WrappedComponent
              testData={testData}
              isTestLoading={customTestLoading || customTestFetching}
              refetchTest={refetch}
              {...props}
          />
        );
      };

export default withHocGetTestInfo;
