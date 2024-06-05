import React, {useState} from 'react';
import {FloatButton} from "antd";
import {FolderAddOutlined, SettingOutlined} from "@ant-design/icons";
import s from "../../AdminFloatButton.module.scss";
import {useMedia} from "react-use";
import {useNavigate} from "react-router-dom";

const AdminAddFolderGroup = () => {
  const isPC = useMedia('(min-width: 768px)');
  const navigate = useNavigate()


  return (
    <>
      <FloatButton
        type="primary"
        style={{right: isPC ? 64 : 14}}
        onClick={() => {
          navigate('/admin/setting')
        }}
        icon={<div className={s.iconAddWrapper}><SettingOutlined style={{fontSize: 24}}/></div>}
      >
        <div></div>
      </FloatButton>
    </>
  );
};

export default AdminAddFolderGroup;