import React from 'react';
import {Layout} from 'antd';
import UpdateQuestionForm from '../../components/UpdateQuestionForm/UpdateQuestionForm';
import {useParams} from "react-router-dom";

const UpdateQuestionPage = () => {
  return (
    <Layout className={'layout'}>
      <div className="container main-wrapper">
        <h1 className={'title'}>
          Редактирование вопроса
        </h1>
        <UpdateQuestionForm />
      </div>
    </Layout>
  );
};

export default UpdateQuestionPage;
