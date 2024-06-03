import React, {useState} from 'react';
import {FloatButton} from "antd";
import {FolderAddOutlined} from "@ant-design/icons";
import s from "../AdminFloatButton.module.scss";
import CreateNewForder from "../../AdminForm/CreateNewForder/CreateNewForder";
import {IconAddNewTest} from "../../../utils/ui/icons/IconAddNewTest";

const AdminAddFolderGroup = () => {
  const [newFolderOpen, setNewFolderOpen] = useState(false);

  const handleCreateFolder = () => {
    setNewFolderOpen(true);
  }

  return (
    <>
      <FloatButton.Group
        trigger="click"
        type="primary"
        style={{right: 114}}
        onClick={handleCreateFolder}
        icon={<div className={s.iconAddWrapper}><FolderAddOutlined style={{fontSize: 24}}/></div>}
      >
        <div></div>
      </FloatButton.Group>
      <CreateNewForder open={newFolderOpen} setOpen={setNewFolderOpen}/>
    </>
  );
};

export default AdminAddFolderGroup;