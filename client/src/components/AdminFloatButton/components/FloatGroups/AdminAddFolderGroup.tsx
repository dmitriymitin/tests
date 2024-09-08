import React, {useState} from 'react';
import {FloatButton} from 'antd';
import {FolderAddOutlined} from '@ant-design/icons';
import s from '../../AdminFloatButton.module.scss';
import CreateNewForder from '../../../AdminTestsListForm/CreateNewForder/CreateNewForder';
import {IconAddNewTest} from '../../../../utils/ui/icons/IconAddNewTest';
import {useMedia} from 'react-use';
import {useSelectTestsStore} from '../../../../store/folders/useSelectTestsStore';

const AdminAddFolderGroup = () => {
  const isPC = useMedia('(min-width: 768px)');
  const selectTestsStore = useSelectTestsStore(store => store);
  const [newFolderOpen, setNewFolderOpen] = useState(false);

  const handleCreateFolder = () => {
    selectTestsStore.setCurrentAction(undefined);
    setNewFolderOpen(true);
  };

  return (
    <>
      <FloatButton
        type="primary"
        style={{right: isPC ? 114 : 64}}
        onClick={handleCreateFolder}
        icon={<div className={s.iconAddWrapper}><FolderAddOutlined style={{fontSize: 24}}/></div>}
      >
        <div></div>
      </FloatButton>
      <CreateNewForder open={newFolderOpen} setOpen={setNewFolderOpen}/>
    </>
  );
};

export default AdminAddFolderGroup;
