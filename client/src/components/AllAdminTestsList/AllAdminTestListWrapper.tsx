'use client';
import s from './AllAdminTestsList.module.scss';
import React, {FC, memo, useEffect, useRef, useState} from 'react';
import AllAdminTestsList from './AllAdminTestsList';
import {message, Popconfirm, Segmented, Select, Spin} from 'antd';
import {EFilterById, EFilterTranslate, TFilterById} from '../../api/test/type';
import {useAllFolder} from '../../http/hooks/useAllFolder';
import FolderFunctionBlock from './FolderFunctionBlock/FolderFunctionBlock';
import ContextMenuWrapper from '../ui/ContextMenuWrapper/ContextMenuWrapper';
import clsx from 'clsx';
import gs from '../../GlobalStyles.module.scss';
import CreateNewForder from '../AdminTestsListForm/CreateNewForder/CreateNewForder';
import {useAllTest} from '../../http/hooks/useAllTest';
import {useMutation, useQueryClient} from 'react-query';
import {createNewCustomTest, createNewTestWithDescription, deleteFolder} from '../../api/test';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {RouteNames} from "../../router";
import NewTestModalDrawer from "../NewTestModalDrawer";
import {getFormateDate} from "../../utils/getFormateDate";
import {useNavigate} from "react-router-dom";
import {useSelectTestsStore} from "../../store/folders/useSelectTestsStore";

interface AllAdminTestListWrapperProps {}

const AllAdminTestListWrapper: FC<AllAdminTestListWrapperProps> = ({}) => {
  const [showTestInFolder, setShowTestInFolder] = useState<number>(0);
  const [newTestOpen, setNewTestOpen] = useState(false);
  const [filterById, setFilterById] = useState<string>('2');
  const [folderId, setFolderId] = useState<string | undefined>(localStorage.getItem('currentFolder') || undefined);
  const [secondFolderId, setSecondFolderId] = useState<string | undefined>('');
  const navigate = useNavigate();
  const isMounted = useRef(false);
  const {
    data: allFolder,
    isLoading: isFolderLoading,
    invalidate: invalidateFolder
  } = useAllFolder();
  const {
    mutateAsync: deleteFolderTrigger
  } = useMutation(deleteFolder);
  const [isChangeModalShow, setIsChangeModalShow] = useState(false);
  const {data, invalidate} = useAllTest();
  const {
    mutateAsync: createCustomTestTrigger,
    isLoading: createCustomTestLoading,
  } = useMutation(createNewCustomTest);
  const {
    mutateAsync: createNewTestTrigger,
    isLoading: isCreateNewTestLoading
  } = useMutation(createNewTestWithDescription);
  const queryClient = useQueryClient();
  const selectTestsStore = useSelectTestsStore(store => store);
  const [newFolderOpen, setNewFolderOpen] = useState(false);


  useEffect(() => {
    const id = localStorage.getItem('currentFolder');
    setFolderId(id || undefined);
  }, [allFolder]);

  const handleDeleteFolder = async (id: string) => {
    try {
      await deleteFolderTrigger(id || secondFolderId || '0');
      await invalidate();
      await invalidateFolder();
      localStorage.removeItem('currentFolder');
    } catch (e) {
      message.error('Ошибка при удалениии папки');
    }
  };

  const handleFilterChange = (e: string) => {
    setFilterById(e);
  };

  const handleFolderChange = (e: any) => {
    if (!e) {
      setFolderId(undefined);
      setSecondFolderId(undefined);
      localStorage.removeItem('currentFolder');
    } else {
      localStorage.setItem('currentFolder', e);
      setSecondFolderId(e);
      setFolderId(e);
    }
  };

  const handleCreateCustomTest = async () => {
    try {
      const date = new Date();
      const createDate = getFormateDate(date);
      const res = await createCustomTestTrigger(createDate);
      navigate(RouteNames.CREATE_CUSTOM_TEST + `/${res._id}`);
    } catch (e) {
      message.error('Ошибка при создании теста');
    }
  };

  const handleCreateCustomTestWithDescription = async () => {
    try {
      const date = new Date();
      const createDate = getFormateDate(date);
      const res = await createNewTestTrigger({
        title: 'Тест с описанием',
        quantityQuestion: 1,
        createDate
      });
      navigate(RouteNames.CREATE_CUSTOM_TEST_DESCRIPTION + `/${res._id}`);
      await queryClient.invalidateQueries({queryKey: ['allTests']});
    } catch (e) {
      message.error('Ошибка при создании теста');
    }
  };

  const handleCreateFolder = () => {
    selectTestsStore.setCurrentAction(undefined);
    setNewFolderOpen(true);
  };

  return (
    <div className={s.all__tests__list}>
      <NewTestModalDrawer open={newTestOpen} setOpen={setNewTestOpen}/>
      <CreateNewForder open={newFolderOpen} setOpen={setNewFolderOpen}/>
      <div className={s.header__wrapper}>
        <h1 className={'title'}>
          Список тестов
        </h1>
        <Select
          defaultValue={filterById}
          className={s.select}
          options={Object.keys(EFilterTranslate).map((el, index) => ({
            label: EFilterTranslate[el],
            value: EFilterById[el as TFilterById]
          }))}
          onChange={handleFilterChange}
        />
      </div>
      <div className="flex-row flex-wrap gap-10">
        <button
          className={clsx('clearButton', gs.btnTitleMiddle)}
          onClick={() => setNewTestOpen(true)}
        >
          <PlusOutlined/>
          Тест на доске
        </button>
        <button
          className={clsx('clearButton', gs.btnTitleMiddle)}
          onClick={handleCreateCustomTestWithDescription}
        >
          <PlusOutlined/>
          Тест с описанием
        </button>
        <button
          className={clsx('clearButton', gs.btnTitleMiddle)}
          onClick={handleCreateCustomTest}
        >
          <PlusOutlined/>
          Тест с вопросами
        </button>
      </div>
      <div className="flex-row flex-wrap gap-10">
        <button
          className={clsx('clearButton', gs.btnTitleMiddle)}
          onClick={handleCreateFolder}
        >
          <PlusOutlined/>
          Создать папку
        </button>
      </div>
      {isFolderLoading
        ? <div className={s.folderLoading}><Spin/></div>
        : allFolder && allFolder.length > 0 &&
          <Segmented
              className={clsx(s.segmented, 'boxShadow3')}
              value={folderId || 0}
              defaultValue={folderId || 0}
              onChange={handleFolderChange}
              maxLength={5}
              style={{marginTop: 15, marginBottom: 15}}
              options={
                [
                  {
                    value: 0,
                    label: 'Все тесты'
                  },
                  ...allFolder?.map((el, index) => ({
                    value: el._id,
                    label: <ContextMenuWrapper
                      text={<>
                        <button
                          className={clsx('clearButton', gs.btn)}
                          onClick={() => {
                            setSecondFolderId(el._id);
                            setIsChangeModalShow(true);
                          }}
                        >
                          <div className={s.btnChange}>
                            <EditOutlined style={{fontSize: 16}}/>
                            Изменить папку
                          </div>
                        </button>
                        <Popconfirm
                          title="Удалить текущую папку"
                          description="Вы уверены, что хотите удалить текущую папку?"
                          onConfirm={() => {
                            setSecondFolderId(el._id);
                            handleDeleteFolder(el._id);
                          }}
                          okText="Да"
                          cancelText="Нет"
                        >
                          <button className={clsx('clearButton', gs.btn, gs.btnDanger)}>
                            <div className={s.btnDelete}>
                              <DeleteOutlined style={{fontSize: 16}}/>
                              Удалить папку
                            </div>
                          </button>
                        </Popconfirm>
                      </>
                      }
                    >
                      {el.name}
                    </ContextMenuWrapper>
                  }))
                ]
              }
              block
          />
      }
      {!folderId && allFolder && allFolder.length > 0 &&
          <div className={s.questionWrapper}>
              Отображать тесты, которые уже находятся в папке?
              <Segmented
                  className="boxShadow3"
                  onChange={e => setShowTestInFolder(e as any)}
                  defaultValue={showTestInFolder}
                  block
                  style={{width: 200}}
                  options={[{
                    label: 'Да',
                    value: 1
                  },
                    {
                      label: 'Нет',
                      value: 0
                    }
                  ]}
              />
          </div>
      }
      <AllAdminTestsList
        showTestInFolder={folderId ? 1 : showTestInFolder}
        isShowBadge={!folderId}
        filterById={filterById}
        folderId={folderId}
      />
      <CreateNewForder
        open={isChangeModalShow}
        setOpen={setIsChangeModalShow}
        folderId={secondFolderId}
        activeTestIdsDefault={data?.reduce((acc, el, index) => {
          if (el.folderId === secondFolderId) {
            acc.push(el._id);
          }

          return acc;
        }, [] as string[])}
        isChange={true}
        titleFolder={allFolder?.find(el => el._id === secondFolderId)?.name}
      />
    </div>);
};

export default memo(AllAdminTestListWrapper);
