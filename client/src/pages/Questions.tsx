import React, {FC} from 'react';
import {Layout} from "antd";
import AllQuestions from "../components/AllQuestions/AllQuestions";

const Questions:FC = () => {
  return (
    <Layout className={'layout'}>
      <div className="container">
        <AllQuestions/>
      </div>
    </Layout>
  );
};

export default Questions;
