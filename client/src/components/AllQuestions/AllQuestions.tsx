import sC from './AllQuestions.module.scss'
import React from 'react';
import {useNavigate} from "react-router-dom";
import {useQuery} from "react-query";
import {getUsersAllTests} from "../../api/test";
import {Button, message, Spin} from "antd";
import s from "../AllTest/AllTest.module.scss";
import clsx from "clsx";
import gs from "../../GlobalStyles.module.scss";
import {PlusOutlined} from "@ant-design/icons";
import {RouteNames} from "../../router";
import {getFormateDate} from "../../utils/getFormateDate";

const AllQuestions = () => {
  const navigate = useNavigate();

  const {
    data: allTest,
    isLoading: isAllTestLoading,
    isFetching
  } = useQuery('allUsersTests', getUsersAllTests, {
    refetchOnWindowFocus: false
  });


  if (!allTest || isAllTestLoading || isFetching) {
    return (
      <div style={{
        height: '500px',
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Spin size={'large'}/>
      </div>
    )
  }

  const addQuestionBtn = (
    <button
      className={clsx('clearButton', gs.btnTitle)}
      onClick={() => navigate(RouteNames.ADMIN_QUESTION_CREATE)}
    >
      <PlusOutlined/>
      Добавить вопрос
    </button>
  )

  if (allTest.length === 0) {
    return (
      <div className={sC.noQuestion}>
        Вопросов пока нет
        {addQuestionBtn}
      </div>
    )
  }

  return (
    <div className={sC.wrapper}>
      <div className={sC.header}>
        <h1 className={"title"}>
          Список вопросов
        </h1>
        {addQuestionBtn}
      </div>
      <div className={s.all__tests__list}>
        {allTest.map(el =>
          <div key={el._id} className={clsx(s.all__tests__list__test__item, 'testBackground')}>
            <p className={s.title}>
              {el.title}
            </p>

            <div className={s.btns}>
              <Button
                type={'primary'}
                onClick={() => navigate(`/tests/${el._id}`)}
              >
                Пройти
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default AllQuestions;