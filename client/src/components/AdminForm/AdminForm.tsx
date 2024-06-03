import React, {useState} from 'react';
import s from './AdminForm.module.scss'
import {Button, Collapse, message, Popconfirm} from "antd";
import ChangePasswordModalDrawer from "../ChangePasswordModalDrawer";
import NewTestModalDrawer from "../NewTestModalDrawer";
import {AuthActionCreators} from "../../store/reducers/auth/action-creators";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useMutation, useQueryClient} from "react-query";
import {
    clearAllTestResultsFetcher, closeAllTestFetcher,
    createNewCustomTest,
    createNewTest,
    createNewTestWithDescription, openAllTestFetcher
} from "../../api/test";
import ChangeAllTestFirstQuestion from "../AllAdminTestsList/ChangeAllTestFirstQuestion/ChangeAllTestFirstQuestion";
import NewTestModalDrawerWithDescription from "../NewTestModalDrawerWithDescription";
import {getFormateDate} from "../../utils/getFormateDate";
import AllAdminTestListWrapper from "../AllAdminTestsList/AllAdminTestListWrapper";
import CreateNewForder from "./CreateNewForder/CreateNewForder";

const AdminForm = () => {
    const [newTestOpen, setNewTestOpen] = useState(false)
    const [newTestDescriptionOpen, setNewTestDescriptionOpen] = useState(false)
    const [changePasswordOpen, setChangePasswordModal] = useState(false)
    const dispatch = useDispatch();

    return (
      <>
          <div className={s.admin__form}>
              <ChangePasswordModalDrawer open={changePasswordOpen} setOpen={setChangePasswordModal}/>
              <div className={s.title__wrapper}>
                  <h1 className="title-admin">
                      Страница администратора
                  </h1>
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
              </div>
              <ChangeAllTestFirstQuestion/>
              <AllAdminTestListWrapper/>
              <NewTestModalDrawer open={newTestOpen} setOpen={setNewTestOpen}/>
                <NewTestModalDrawerWithDescription open={newTestDescriptionOpen} setOpen={setNewTestDescriptionOpen}/>
            </div>
        </>

    );
};

export default AdminForm;
