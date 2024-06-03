import React, {useState} from 'react';
import s from "./FolderFunctionBlock.module.scss";
import {Button, Collapse, message, Popconfirm} from "antd";
import {useMutation} from "react-query";
import {deleteFolder} from "../../../api/test";
import {useAllTest} from "../../../http/hooks/useAllTest";
import {useAllFolder} from "../../../http/hooks/useAllFolder";
import CreateNewForder from "../../AdminForm/CreateNewForder/CreateNewForder";

interface IFolderFunctionBlockProps {
  folderId: string
  folderName?: string;
}

const FolderFunctionBlock = ({folderId, folderName = ''}: IFolderFunctionBlockProps) => {
  const [isChangeModalShow, setIsChangeModalShow] = useState(false);
  const {
    mutateAsync: deleteFolderTrigger
  } = useMutation(deleteFolder)
  const {data, invalidate} = useAllTest();
  const {invalidate: invalidateFolder} = useAllFolder();
  const handleDeleteFolder = async () => {
    try {
      await deleteFolderTrigger(folderId);
      await invalidate();
      await invalidateFolder();
      localStorage.removeItem('currentFolder');
    } catch (e) {
      message.error('Ошибка при удалениии папки');
    }
  }

  const items: any = [
    {
      key: '1',
      label: 'Функции для управления текущей папкой',
      children: <div className={s.btns}>
        <Button
          size={'large'}
          className={s.btn}
          type={"primary"}
          onClick={() => setIsChangeModalShow(true)}
        >
          Изменить папку
        </Button>
        <Popconfirm
          title="Удалить текущую папку"
          description="Вы уверены, что хотите удалить текущую папку?"
          onConfirm={handleDeleteFolder}
          okText="Да"
          cancelText="Нет"
        >
          <Button
            size={'large'}
            className={s.btn}
            danger
          >
            Удалить папку
          </Button>
        </Popconfirm>
      </div>,
    }
  ];

  return (
    <div>
      {/*<Collapse items={items}/>*/}
      <CreateNewForder
        open={isChangeModalShow}
        setOpen={setIsChangeModalShow}
        folderId={folderId}
        activeTestIdsDefault={data?.reduce((acc, el, index) => {
          if (el.folderId === folderId) acc.push(el._id)
          return acc
        }, [] as string[])}
        isChange={true}
        titleFolder={folderName}
      />
    </div>
  );
};

export default FolderFunctionBlock;