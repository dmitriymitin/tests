import React from 'react';
import s from './AdminSetting.module.scss';
import {Layout} from 'antd';
import AdminSettingBlock from '../../components/AdminSettingBlock/AdminSettingBlock';
const AdminSetting = () => {
  return (
    <Layout className={'layout'}>
      <div className="container">
        <AdminSettingBlock/>
      </div>
    </Layout>
  );
};

export default AdminSetting;
