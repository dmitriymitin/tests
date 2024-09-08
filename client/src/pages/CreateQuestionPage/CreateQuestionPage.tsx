import React from 'react';
import {Layout} from 'antd';
import UpdateQuestionForm from '../../components/UpdateQuestionForm/UpdateQuestionForm';

const CreateQuestionPage = () => {
  return (
    <Layout className={'layout'}>
      <div className="container">
        <h1 className={'title'}>
          Создание вопроса
        </h1>
        <UpdateQuestionForm/>
      </div>
    </Layout>
  );
};

export default CreateQuestionPage;
