import React, {useState} from 'react';
import s from './AdminTestsListForm.module.scss';
import {Button, Collapse, message, Popconfirm} from 'antd';
import ChangePasswordModalDrawer from '../ChangePasswordModalDrawer';
import NewTestModalDrawer from '../NewTestModalDrawer';
import {AuthActionCreators} from '../../store/reducers/auth/action-creators';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useMutation, useQueryClient} from 'react-query';
import {
  clearAllTestResultsFetcher, closeAllTestFetcher,
  createNewCustomTest,
  createNewTest,
  createNewTestWithDescription, openAllTestFetcher
} from '../../api/test';
import ChangeAllTestFirstQuestion from '../AllAdminTestsList/ChangeAllTestFirstQuestion/ChangeAllTestFirstQuestion';
import NewTestModalDrawerWithDescription from '../NewTestModalDrawerWithDescription';
import {getFormateDate} from '../../utils/getFormateDate';
import AllAdminTestListWrapper from '../AllAdminTestsList/AllAdminTestListWrapper';
import CreateNewForder from './CreateNewForder/CreateNewForder';

const AdminTestsListForm = () => {
  const [newTestOpen, setNewTestOpen] = useState(false);
  const [newTestDescriptionOpen, setNewTestDescriptionOpen] = useState(false);

  return (
    <>
      <div className={s.admin__form}>
        <AllAdminTestListWrapper/>
        <NewTestModalDrawer open={newTestOpen} setOpen={setNewTestOpen}/>
        <NewTestModalDrawerWithDescription open={newTestDescriptionOpen} setOpen={setNewTestDescriptionOpen}/>
      </div>
    </>

  );
};

export default AdminTestsListForm;
