import React from 'react';
import {Layout} from 'antd';
import CreateCustomTestForm from '../../components/CreateCustomTestForm/CreateCustomTestForm';
import {useLocation} from 'react-router-dom';

const CreateCustomTest = () => {
  return (
    <Layout className={'layout'}>
      <div className="container">
        <CreateCustomTestForm />
      </div>
    </Layout>
  );
};

export default CreateCustomTest;
