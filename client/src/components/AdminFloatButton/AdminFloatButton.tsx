import React from 'react';
import AdminAddFloatGroup from './components/FloatGroups/AdminAddFloatGroup';
import AdminEditFloatGroup from './components/FloatGroups/AdminEditFloatGroup';
import AdminAddFolderGroup from './components/FloatGroups/AdminAddFolderGroup';
import {useLocation} from 'react-router-dom';
import AdminAddSettingGroup from './components/FloatGroups/AdminAddSettingGroup';
import {RouteNames} from '../../router';

const AdminFloatButton = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname === RouteNames.ADMIN_TESTS_LIST && <AdminEditFloatGroup/>}
      {/* <AdminAddFloatGroup/> */}
      {/*<AdminAddFolderGroup/>*/}
      {/*<AdminAddSettingGroup/>*/}
    </>
  );
};

export default AdminFloatButton;
