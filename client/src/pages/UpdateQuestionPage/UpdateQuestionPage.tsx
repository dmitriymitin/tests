import React from 'react';
import {Layout} from 'antd';
import UpdateQuestionForm from '../../components/UpdateQuestionForm/UpdateQuestionForm';

const UpdateQuestionPage = () => {
  const questionId = location.pathname.split('/')[4];
  return (
    <Layout className={'layout'}>
      <div className="container">
        <h1 className={'title'}>
          Редактирвоание вопроса
        </h1>
        <UpdateQuestionForm questionId={questionId}/>
      </div>
    </Layout>
  );
};

export default UpdateQuestionPage;
