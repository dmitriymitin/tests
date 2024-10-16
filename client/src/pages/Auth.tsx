import React, {FC} from 'react';
import {Layout, Row} from 'antd';
import AuthForm from '../components/AuthForm/AuthForm';

const Auth: FC = () => {
  return (
    <Layout className={'layout'}>
      <Row justify="center" align="middle" className="auth">
        <AuthForm/>
      </Row>
    </Layout>
  );
};

export default Auth;
