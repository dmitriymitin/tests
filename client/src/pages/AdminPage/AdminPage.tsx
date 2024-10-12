import React, {useState} from 'react';
import clsx from 'clsx';
import s from './AdminPage.module.scss';
import ChangePasswordModalDrawer from '../../components/ChangePasswordModalDrawer';
import {useDispatch} from 'react-redux';
import {Button} from 'antd';
import {AuthActionCreators} from '../../store/reducers/auth/action-creators';
import ChangeAllTestFirstQuestion
  from "../../components/AllAdminTestsList/ChangeAllTestFirstQuestion/ChangeAllTestFirstQuestion";

const AdminPage = () => {
  const [changePasswordOpen, setChangePasswordModal] = useState(false);
  const dispatch = useDispatch();

  return (
    <div className={clsx(s.wrapper, 'container')}>
      <ChangePasswordModalDrawer open={changePasswordOpen} setOpen={setChangePasswordModal}/>
      <div className={s.title__wrapper}>
        <h1 className="title-admin">
          Страница администратора
        </h1>
        <div className={'tooltipWrapper'} style={{background: 'none'}}>
          <Button
            className={s.exitBtn}
            onClick={() => setChangePasswordModal(true)}
          >
            Изменить пароль
          </Button>
          <Button className={s.exitBtn} danger
                  onClick={() => AuthActionCreators.logout()(dispatch)}>Выйти</Button>
        </div>
      </div>
      <ChangeAllTestFirstQuestion/>
    </div>
  );
};

export default AdminPage;
