import React from 'react';
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useLocation, useNavigate} from 'react-router-dom'
import {RouteNames} from "../router";
import clsx from "clsx";
import IsVisible from "./ui/isVisibleWrapper";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname
  const {isAuth} = useTypedSelector(state => state.auth)

  return (
    <div className="navbar">
      <div className={"container"}>
        <div style={{
          display: "flex",
          justifyContent: "space-between"
        }}>
          <button
            className={clsx('clearButton', 'text')}
            onClick={() => navigate('/')}
          >
            Главная
          </button>
              <div className={'btnNavbarWrapper'} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20
              }}>
                <IsVisible isVisible={isAuth}>
                  <button
                    className={clsx('clearButton', 'text', {active: [RouteNames.ADMIN_QUESTIONS_LIST, RouteNames.ADMIN_QUESTION_CREATE, RouteNames.ADMIN_QUESTION_UPDATE].includes(pathname as any)})}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      navigate(RouteNames.ADMIN_QUESTIONS_LIST);
                    }}
                  >
                    Вопросы
                  </button>
                </IsVisible>
                {isAuth && <>
                    <button
                        className={clsx('clearButton', 'text', {active: pathname === RouteNames.ADMIN_TESTS_LIST})}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          navigate(RouteNames.ADMIN_TESTS_LIST);
                        }}
                    >
                        Тесты
                    </button>
                    <button
                        className={clsx('clearButton', 'text', {active: pathname === RouteNames.ADMIN_SEARCH_STUDENTS})}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          navigate(RouteNames.ADMIN_SEARCH_STUDENTS);
                        }}>
                        Результаты студентов
                    </button>
                    <button
                        className={clsx('clearButton', 'text', {active: pathname === RouteNames.ADMIN})}
                        onClick={() => navigate(RouteNames.ADMIN)}
                    >
                        Админ
                    </button>
                </>}
              </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
