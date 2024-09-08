import sC from './AllQuestions.module.scss';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useQuery} from 'react-query';
import {getUsersAllTests} from '../../api/test';
import {Button, Empty, message, Spin} from 'antd';
import s from '../AllTest/AllTest.module.scss';
import clsx from 'clsx';
import gs from '../../GlobalStyles.module.scss';
import {PlusOutlined} from '@ant-design/icons';
import {RouteNames} from '../../router';
import {getFormateDate} from '../../utils/getFormateDate';
import {useAllTest} from '../../http/hooks/useAllTest';
import {useAllQuestion} from '../../http/hooks/useAllQuestion';
import IsVisible from '../ui/isVisibleWrapper';
import PillarHead from './PillarHead/PillarHead';
import AllQuestionsSpins from './AllQuestionsSpins';
import {useTypedSelector} from '../../hooks/useTypedSelector';
import AllQuestionsEmpty from './AllQuestionsEmpty';
import questions from '../../pages/Questions';
import Question from './Question/Question';
import {useAllGroupQuestion} from '../../http/hooks/useAllGroupQuestion';
import AddNewThemeModalDrawer from './AddNewThemeModalDrawer/AddNewThemeModalDrawer';

const AllQuestions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const {data: allQuestion, isLoading: isAllQuestionLoading, isFetching: isAllQuestionFetching} = useAllQuestion();
  const {data: allGroupQuestion, isLoading: isAllQuestionGroupLoading, isFetching: isAllQuestionGroupFetching} = useAllGroupQuestion();
  const isLoadingQuestions = !allQuestion || isAllQuestionLoading || isAllQuestionFetching;
  const isLoadingThemes = !allGroupQuestion || isAllQuestionGroupLoading || isAllQuestionGroupFetching;

  const addQuestionBtn = (
    <button
      className={clsx('clearButton', gs.btnTitle)}
      onClick={() => navigate(RouteNames.ADMIN_QUESTION_CREATE)}
    >
      <PlusOutlined/>
      Добавить вопрос
    </button>
  );

  if (allQuestion?.length === 0) {
    return (
      <div className={sC.noQuestion}>
        Вопросов пока нет
        {addQuestionBtn}
      </div>
    );
  }

  return (
    <div className={sC.wrapper}>
      <AddNewThemeModalDrawer open={isModalOpen} setOpen={setIsModalOpen}/>
      <div className={sC.header}>
        <h1 className={'title'}>
          Список вопросов
        </h1>
      </div>
      <div className="pillar-list base-table-box">
        <div className="pillar-col">
          <PillarHead title={'Темы'} btnText={'Добавить тему'}
                      btnClick={() => setIsModalOpen(true)}/>
          <AllQuestionsSpins isLoading={isLoadingThemes}/>
          <IsVisible isVisible={!isLoadingThemes && !allGroupQuestion.length}>
            <AllQuestionsEmpty text={''}/>
          </IsVisible>
          <IsVisible isVisible={!isLoadingThemes}>
            {allGroupQuestion?.map((el, index) => (
              <div key={el._id} className="pillar-row flex-row">
                {el.name}
              </div>
            ))}
          </IsVisible>
        </div>
        <div className="pillar-col">
          <PillarHead title={'Вопросы'} btnText={'Добавить вопрос'}
                      btnClick={() => navigate(RouteNames.ADMIN_QUESTION_CREATE)}/>
          <AllQuestionsSpins isLoading={isLoadingQuestions}/>
          <IsVisible isVisible={!isLoadingQuestions && !allQuestion.length}>
            <AllQuestionsEmpty text={'Вопросов пока нет'}/>
          </IsVisible>
          <IsVisible isVisible={!isLoadingQuestions}>
            <div className="pillar-row flex-row">
              {allQuestion?.map((el, index) => (
                <Question key={el._id} question={el}/>
              ))}
            </div>
          </IsVisible>
        </div>
      </div>
    </div>

  );
};

export default AllQuestions;
