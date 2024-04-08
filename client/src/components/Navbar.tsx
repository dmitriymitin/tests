import React, {useState} from 'react';
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useNavigate} from 'react-router-dom'
import {Button, Tooltip} from "antd";
import s from "./AdminForm/AdminForm.module.scss";
import {AuthActionCreators} from "../store/reducers/auth/action-creators";
import {useDispatch} from "react-redux";
import ChangePasswordModalDrawer from "./ChangePasswordModalDrawer";

const Navbar = () => {
    const navigate = useNavigate();
    const {isAuth} = useTypedSelector(state => state.auth)
    const [changePasswordOpen, setChangePasswordModal] = useState(false)
    const dispatch = useDispatch();

    return (
        <div className="navbar">
            <div className={"container"}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <button className={'clearButton'}  onClick={() => navigate('/')}>
                        Главная страница
                    </button>
                    {isAuth &&
                      <div className={'btnNavbarWrapper'}>
                          <button className={'clearButton'} onClick={() => {
                              navigate('/admin/searchStudents');
                          }}>
                              Поиск результатов студентов
                          </button>
                          <Tooltip
                            destroyTooltipOnHide
                            color={'white'}
                            placement="bottom"
                            title={
                              <div className={'tooltipWrapper'}>
                                  <Button
                                    className={s.exitBtn}
                                    onClick={() => setChangePasswordModal(true)}
                                  >
                                      Изменить пароль
                                  </Button>
                                  <Button className={s.exitBtn} danger
                                          onClick={() => AuthActionCreators.logout()(dispatch)}>Выйти</Button>
                              </div>
                            }
                          >
                          <button className={'clearButton'} onClick={() => navigate('/admin')}>
                              Админ панель
                          </button>
                          </Tooltip>
                      </div>
                    }
                </div>
            </div>
            <ChangePasswordModalDrawer open={changePasswordOpen} setOpen={setChangePasswordModal}/>
        </div>
    );
};

export default Navbar;
