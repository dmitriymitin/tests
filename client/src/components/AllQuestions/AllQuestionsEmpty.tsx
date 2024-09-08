import React from 'react';
import IsVisible from "../ui/isVisibleWrapper";
import {Empty, Spin} from "antd";

interface IAllQuestionsEmptyProps {
  text?: string;
}

const AllQuestionsEmpty = ({text}: IAllQuestionsEmptyProps) => {
  return (
    <div className="status-block h220p">
      <Empty description={text}/>
    </div>
  );
};

export default AllQuestionsEmpty;