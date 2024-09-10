import sC from './AllQuestions.module.scss';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import clsx from 'clsx';
import gs from '../../GlobalStyles.module.scss';
import {PlusOutlined} from '@ant-design/icons';
import {RouteNames} from '../../router';
import AllGroupQuestion from './AllGroupQuestion/AllGroupQuestion';
import AllQuestionsBlock from './AllQuestionsBlock/AllQuestionsBlock';
import AddNewThemeModalDrawer from "./AddNewThemeModalDrawer/AddNewThemeModalDrawer";

const AllQuestions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={sC.wrapper}>
      <AddNewThemeModalDrawer open={isModalOpen} setOpen={setIsModalOpen}/>
      <div className={sC.header}>
        <h1 className={'title'}>
          Список вопросов
        </h1>
      </div>
      <div className="flex-row gap-10">
        <button
          className={clsx('clearButton', gs.btnTitleMiddle)}
          onClick={() => navigate(RouteNames.ADMIN_QUESTION_CREATE)}
        >
          <PlusOutlined/>
          Добавить вопрос
        </button>
        <button
          className={clsx('clearButton', gs.btnTitleMiddle)}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusOutlined/>
          Добавить тему
        </button>
      </div>
      <AllGroupQuestion/>
      <AllQuestionsBlock/>
    </div>

  );
};

export default AllQuestions;
