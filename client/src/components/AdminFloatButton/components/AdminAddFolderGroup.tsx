import React, {useState} from 'react';
import {FloatButton} from "antd";
import {FolderAddOutlined} from "@ant-design/icons";
import s from "../AdminFloatButton.module.scss";
import CreateNewForder from "../../AdminForm/CreateNewForder/CreateNewForder";
import {IconAddNewTest} from "../../../utils/ui/icons/IconAddNewTest";
import {useMedia} from "react-use";

const AdminAddFolderGroup = () => {
  const isPC = useMedia('(min-width: 768px)');
  const [newFolderOpen, setNewFolderOpen] = useState(false);

  const handleCreateFolder = () => {
    setNewFolderOpen(true);
  }

  return (
    <>
      <FloatButton.Group
        trigger="click"
        type="primary"
        style={{right: isPC ? 114 : 64}}
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