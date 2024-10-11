import React, {memo} from 'react';
import {Layout} from 'antd';
import CreateCustomTestForm from '../../components/CreateCustomTestForm/CreateCustomTestForm';
import {compose} from '../../utils/helpers';
import withHocAllQuestion from '../../http/HOC/withHocAllQuestion';
import withHocGetTestInfo from "../../http/HOC/withHocGetTestInfo";
import {useParams} from "react-router-dom";

const CreateCustomTest = () => {
  const {testId} = useParams();
  const CreateCustomTestFormWithHoc = compose(
    memo,
    withHocAllQuestion,
    withHocGetTestInfo({testId}),
  )(CreateCustomTestForm);

  return (
    <Layout className={'layout'}>
      <div className="container">
        <CreateCustomTestFormWithHoc/>
      </div>
    </Layout>
  );
};

export default CreateCustomTest;
